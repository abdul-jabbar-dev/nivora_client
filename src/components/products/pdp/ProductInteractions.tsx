"use client";

import { useState, useEffect } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { Product } from "@/types/product";

import { cn } from "@/lib/utils";
import { ENV } from "@/lib/env";

interface ProductInteractionsProps {
  product: Product;
  className?: string;
  compact?: boolean;
}

export function ProductInteractions({ product, className, compact = false }: ProductInteractionsProps) {
  const [canInteract, setCanInteract] = useState(false);
  const [interaction, setInteraction] = useState<'like' | 'dislike' | null>(null);
  const [likesCount, setLikesCount] = useState(product.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(product.dislikesCount || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchInteractionStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/products/${product.id}/interaction-status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setCanInteract(data.canInteract);
          setInteraction(data.interaction);
        }
      } catch (err) {
        console.error("Failed to fetch interaction status", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInteractionStatus();
  }, [product.id, supabase.auth]);

  const handleInteract = async (isLike: boolean) => {
    if (!canInteract || isUpdating) return;
    
    setIsUpdating(true);
    // Optimistic update
    const previousInteraction = interaction;
    const previousLikes = likesCount;
    const previousDislikes = dislikesCount;

    if (interaction === (isLike ? 'like' : 'dislike')) {
      // Toggle off
      setInteraction(null);
      if (isLike) setLikesCount(c => c - 1);
      else setDislikesCount(c => c - 1);
    } else {
      // New or change
      setInteraction(isLike ? 'like' : 'dislike');
      if (isLike) {
        setLikesCount(c => c + 1);
        if (interaction === 'dislike') setDislikesCount(c => c - 1);
      } else {
        setDislikesCount(c => c + 1);
        if (interaction === 'like') setLikesCount(c => c - 1);
      }
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/products/${product.id}/interaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ isLike })
      });

      if (!res.ok) {
        throw new Error("Failed to update interaction");
      }
    } catch (err) {
      console.error(err);
      // Revert optimistic update
      setInteraction(previousInteraction);
      setLikesCount(previousLikes);
      setDislikesCount(previousDislikes);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className={cn(!compact && "mt-6 border-t border-border pt-6", "flex items-center gap-4", className)}>
      <Button
        variant={interaction === 'like' ? 'default' : 'outline'}
        size="sm"
        disabled={isLoading || !canInteract || isUpdating}
        onClick={() => handleInteract(true)}
        className="flex items-center gap-2"
        title={!canInteract ? "Only verified purchasers can vote" : ""}
      >
        <ThumbsUp className="w-4 h-4" />
        {likesCount}
      </Button>
      <Button
        variant={interaction === 'dislike' ? 'default' : 'outline'}
        size="sm"
        disabled={isLoading || !canInteract || isUpdating}
        onClick={() => handleInteract(false)}
        className="flex items-center gap-2"
        title={!canInteract ? "Only verified purchasers can vote" : ""}
      >
        <ThumbsDown className="w-4 h-4" />
        {dislikesCount}
      </Button>
      {!canInteract && !isLoading && !compact && (
        <span className="text-xs text-muted-foreground">Only verified purchasers can vote.</span>
      )}
    </div>
  );
}
