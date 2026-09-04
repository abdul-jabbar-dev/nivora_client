"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 bg-background">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-muted-foreground text-lg">
              We're here to help. Reach out to us for any questions or support.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground mb-1">Our friendly team is here to help.</p>
                      <a href="mailto:support@nivora.com" className="font-medium hover:underline">support@nivora.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Phone</h3>
                      <p className="text-muted-foreground mb-1">Mon-Fri from 9am to 6pm.</p>
                      <a href="tel:+8801234567890" className="font-medium hover:underline">+880 1234-567890</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Office</h3>
                      <p className="text-muted-foreground mb-1">Come say hello at our headquarters.</p>
                      <p className="font-medium">123 Main Street, Dhaka 1212, Bangladesh</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-background p-8 rounded-2xl border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background" placeholder="Jane" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input type="text" className="w-full h-11 px-3 rounded-md border border-input bg-background" placeholder="Doe" required />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input type="email" className="w-full h-11 px-3 rounded-md border border-input bg-background" placeholder="jane@example.com" required />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <textarea className="w-full p-3 rounded-md border border-input bg-background min-h-[120px]" placeholder="How can we help you?" required></textarea>
                </div>
                
                <Button type="submit" className="w-full h-11 mt-2">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
