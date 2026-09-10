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
  const [hasVoted, setHasVoted] = useState(false);
  const [isDelivered, setIsDelivered] = useState(false);
  const [interaction, setInteraction] = useState<'like' | 'dislike' | null>(null);
  const [likesCount, setLikesCount] = useState(product.likesCount || 0);
  const [dislikesCount, setDislikesCount] = useState(product.dislikesCount || 0);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchInteractionStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          setIsLoggedIn(false);
          setIsLoading(false);
          return;
        }
        setIsLoggedIn(true);

        const res = await fetch(`${ENV.NEXT_PUBLIC_API_URL}/products/${product.id}/interaction-status`, {
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (res.ok) {
          const data = await res.json();
          setCanInteract(Boolean(data.canInteract));
          setHasVoted(Boolean(data.hasVoted ?? !!data.interaction));
          setIsDelivered(Boolean(data.isDelivered));
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
    if (!canInteract || isUpdating || hasVoted) return;
    
    setIsUpdating(true);
    // Optimistic update
    const previousInteraction = interaction;
    const previousLikes = likesCount;
    const previousDislikes = dislikesCount;

    setInteraction(isLike ? 'like' : 'dislike');
    setHasVoted(true);
    setCanInteract(false);
    if (isLike) setLikesCount(c => c + 1);
    else setDislikesCount(c => c - 1);

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
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.message || "Failed to update interaction");
      }
    } catch (err: any) {
      console.error(err);
      // Revert optimistic update
      setInteraction(previousInteraction);
      setHasVoted(Boolean(previousInteraction));
      setCanInteract(isDelivered && !previousInteraction);
      setLikesCount(previousLikes);
      setDislikesCount(previousDislikes);
      alert(err.message || "Could not record vote. Only delivered orders can vote once.");
    } finally {
      setIsUpdating(false);
    }
  };

  const getHelpText = () => {
    if (isLoading) return "";
    if (hasVoted) return "Feedback submitted (1 vote per product).";
    if (!isLoggedIn) return "Sign in to vote after order delivery.";
    if (!isDelivered) return "Vote available only after order is delivered.";
    return "Verified order: Vote once on this product.";
  };

  return (
    <div className={cn(!compact && "mt-6 border-t border-border pt-6", "flex flex-wrap items-center gap-3 sm:gap-4", className)}>
      <div className="flex items-center gap-2">
        <Button
          variant={interaction === 'like' ? 'default' : 'outline'}
          size="sm"
          disabled={isLoading || !canInteract || hasVoted || isUpdating}
          onClick={() => handleInteract(true)}
          className={cn(
            "flex items-center gap-2 transition-all",
            interaction === 'like' && "ring-2 ring-primary ring-offset-1"
          )}
          title={hasVoted ? "You have already voted on this product" : (!canInteract ? "Only available after order delivery" : "Like this product (1 vote limit)")}
        >
          <ThumbsUp className="w-4 h-4" />
          <span>{likesCount}</span>
        </Button>
        <Button
          variant={interaction === 'dislike' ? 'default' : 'outline'}
          size="sm"
          disabled={isLoading || !canInteract || hasVoted || isUpdating}
          onClick={() => handleInteract(false)}
          className={cn(
            "flex items-center gap-2 transition-all",
            interaction === 'dislike' && "ring-2 ring-primary ring-offset-1"
          )}
          title={hasVoted ? "You have already voted on this product" : (!canInteract ? "Only available after order delivery" : "Dislike this product (1 vote limit)")}
        >
          <ThumbsDown className="w-4 h-4" />
          <span>{dislikesCount}</span>
        </Button>
      </div>

      {!compact && !isLoading && (
        <span className="text-xs text-muted-foreground">
          {getHelpText()}
        </span>
      )}
    </div>
  );
}
