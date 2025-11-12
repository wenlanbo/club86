"use client"

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

// Import images
import img1 from "@/assets/images/DSC03053.jpg";
import img2 from "@/assets/images/DSC03141.jpg";
import img3 from "@/assets/images/DSC03187.jpg";
import img4 from "@/assets/images/DSC03197.jpg";
import img5 from "@/assets/images/egirls june 2025-023.jpg";
import img6 from "@/assets/images/egirls june 2025-059.jpg";

const images = [img1, img2, img3, img4, img5, img6];


const Capability: React.FC<{title: string; items: string[]}> = ({ title, items }) => (
  <Card className="rounded-2xl">
    <CardHeader className="pb-3">
      <CardTitle className="text-xl flex items-center gap-2"><Sparkles className="h-5 w-5"/>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((x, i) => (
          <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 mt-0.5"/> {x}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Horizontal scrolling gallery component with scroll locking
const HorizontalScrollGallery: React.FC<{ images: any[] }> = ({ images }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollContentRef.current;
    
    if (!container || !scrollContent) return;

    let isLocked = false;
    let savedScrollY = 0;
    let scrollProgress = 0; // 0 to 1

    const lockBodyScroll = () => {
      if (isLocked) return;
      savedScrollY = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${savedScrollY}px`;
      document.body.style.width = '100%';
      isLocked = true;
    };

    const unlockBodyScroll = () => {
      if (!isLocked) return;
      const currentTop = parseInt(document.body.style.top || '0', 10);
      const scrollPosition = Math.abs(currentTop) || savedScrollY;
      
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      
      // Use requestAnimationFrame to ensure smooth unlock
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'instant'
        });
      });
      
      isLocked = false;
    };

    const updateHorizontalPosition = (progress: number, smooth: boolean = true) => {
      if (!scrollContent) return;
      progress = Math.max(0, Math.min(1, progress)); // Clamp 0-1 - no infinite scroll
      const totalWidth = scrollContent.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxScroll = Math.max(0, totalWidth - viewportWidth);
      const translateX = progress * maxScroll;
      
      // Add smoother, longer transition
      if (smooth) {
        scrollContent.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      } else {
        scrollContent.style.transition = 'none';
      }
      
      scrollContent.style.transform = `translateX(-${translateX}px)`;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!container || !scrollContent) return;
      
      const rect = container.getBoundingClientRect();
      const headerHeight = 60; // Match the top-[60px] value
      const isPinned = rect.top <= headerHeight && rect.bottom > headerHeight;
      
      // Only handle when pinned and visible
      if (!isPinned) {
        if (isLocked) unlockBodyScroll();
        return;
      }

      // Lock body scroll if not already locked
      if (!isLocked) {
        lockBodyScroll();
      }

      // Check if at boundaries BEFORE updating
      const isAtStart = scrollProgress <= 0.001;
      const isAtEnd = scrollProgress >= 0.999;
      const scrollingUp = e.deltaY < 0;
      const scrollingDown = e.deltaY > 0;

      // If at boundary and trying to scroll past it, unlock immediately
      if ((isAtStart && scrollingUp) || (isAtEnd && scrollingDown)) {
        unlockBodyScroll();
        return; // Allow natural scroll
      }

      // Calculate scroll delta - use slower, smoother sensitivity
      const scrollSpeed = 0.001; // Slower scroll (reduced from 0.003)
      const delta = e.deltaY * scrollSpeed;
      
      // Update scroll progress - strictly clamp to 0-1 (no infinite scroll)
      scrollProgress = Math.max(0, Math.min(1, scrollProgress + delta));
      
      // Check boundaries after update - if hit boundary, unlock immediately
      if (scrollProgress <= 0.001 || scrollProgress >= 0.999) {
        unlockBodyScroll();
        // Still update position to show boundary
        updateHorizontalPosition(scrollProgress, true);
        return;
      }

      // Prevent default and update position
      e.preventDefault();
      updateHorizontalPosition(scrollProgress);
    };

    const handleScroll = () => {
      if (!container || !scrollContent) return;

      const rect = container.getBoundingClientRect();
      const headerHeight = 60; // Match the top-[60px] value
      const isPinned = rect.top <= headerHeight && rect.bottom > headerHeight;

      if (isPinned) {
        // Calculate progress based on how much we've scrolled through the container
        const containerTop = container.offsetTop;
        const containerHeight = container.offsetHeight;
        const scrollY = window.scrollY;
        
        // Calculate how far we've scrolled into the container
        // When container top reaches headerHeight, we start at progress 0
        // When container bottom reaches headerHeight, we end at progress 1
        const scrollIntoContainer = scrollY - (containerTop - headerHeight);
        const calculatedProgress = Math.max(0, Math.min(1, scrollIntoContainer / containerHeight));
        
        // Update progress when entering pinned state
        if (!isLocked) {
          scrollProgress = calculatedProgress;
          updateHorizontalPosition(scrollProgress, false);
          
          // Lock when pinned (unless at boundary) - ensure we unlock if at boundary
          if (scrollProgress > 0.001 && scrollProgress < 0.999) {
            lockBodyScroll();
          } else {
            // At boundary, make sure we're unlocked
            if (isLocked) {
              unlockBodyScroll();
            }
          }
        }
        // When locked, progress is controlled by wheel events
      } else {
        // Unlock when not pinned - always unlock to prevent dead lock
        if (isLocked) {
          unlockBodyScroll();
        }
        // Set initial position
        if (rect.top > headerHeight) {
          // Before section - show first image
          scrollProgress = 0;
          updateHorizontalPosition(0, false);
        } else if (rect.bottom <= headerHeight) {
          // After section - show last image
          scrollProgress = 1;
          updateHorizontalPosition(1, false);
        }
      }
    };

    // Set container height to allow scrolling through all images
    const updateLayout = () => {
      if (!container || !scrollContent) return;
      const viewportHeight = window.innerHeight;
      const isMobile = window.innerWidth < 768;
      const imageHeight = isMobile ? viewportHeight * 0.85 : viewportHeight * 0.90;
      
      // Calculate total horizontal scroll distance
      const totalWidth = scrollContent.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxHorizontalScroll = Math.max(0, totalWidth - viewportWidth);
      
      // Container height should be at least image height, but also enough to scroll through all images
      // This allows vertical scroll to map to horizontal image scrolling
      const containerHeight = Math.max(imageHeight, maxHorizontalScroll);
      container.style.height = `${containerHeight}px`;
    };

    // Wait for images to load
    const imagesElements = scrollContent.querySelectorAll('img');
    let loadedCount = 0;
    const totalImages = imagesElements.length;

    if (totalImages === 0) {
      updateLayout();
    } else {
      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          updateLayout();
        }
      };

      imagesElements.forEach((img: HTMLImageElement) => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
          img.addEventListener('error', checkAllLoaded);
        }
      });
    }

    updateLayout();
    handleScroll(); // Initial call

    // Safety: unlock on visibility change or page unload
    const handleVisibilityChange = () => {
      if (document.hidden && isLocked) {
        unlockBodyScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('resize', updateLayout);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', updateLayout);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      // Always unlock on cleanup to prevent dead lock
      if (isLocked) {
        unlockBodyScroll();
      }
    };
  }, [images.length]);

  return (
    <section 
      id="about" 
      className="overflow-hidden relative"
      ref={containerRef}
    >
      <div className="sticky top-[60px] h-[calc(100vh-60px)] flex items-center overflow-hidden bg-background z-30">
        <div 
          className="flex will-change-transform"
          ref={scrollContentRef}
          style={{ width: 'max-content' }}
        >
          {images.map((img, index) => (
            <div 
              key={index} 
              className="relative w-screen h-[85vh] md:h-[90vh] flex-shrink-0"
            >
              <Image
                src={img}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={true}
                loading="eager"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default function LuxuryAgencyLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="font-semibold tracking-tight">Club86</div>
          <Button asChild size="sm" className="rounded-full">
            <a href="mailto:contact@club86.agency">Let&apos;s Talk</a>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-transparent to-transparent pointer-events-none"/>
        <div className="max-w-7xl mx-auto px-4 md:px-6 w-full relative z-10 text-center">
          <motion.h1 initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.05]">
            We create lasting narratives
          </motion.h1>
          <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} transition={{delay:0.15}} className="mt-6 text-base md:text-lg text-muted-foreground max-w-2xl mx-auto space-y-4">
            <p>We curate moments that move brands forward.</p>
            <p>An agency specializing in experiential marketing, storytelling, and event curation. We partner with leading brands to design experiences that captivate audiences and shape lasting connections.</p>
          </motion.div>
        </div>
      </section>

      {/* HORIZONTAL SCROLLING IMAGE GALLERY */}
      <HorizontalScrollGallery images={images} />

      {/* CTA BANNER */}
      <section className="h-screen flex items-center justify-center bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
          <h3 className="text-2xl md:text-3xl font-semibold">Make Events Memorable</h3>
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section id="work" className="h-screen flex items-center justify-center bg-black">
        <div className="w-full h-full relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/video/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="services" className="border-t bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-12 text-left">
            Our Capabilities
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <Capability title="Strategy" items={[
              "Brand Strategy",
              "Positioning & Narrative",
              "Campaign & Rollout",
              "Customer Acquisition",
              "Performance Marketing"
            ]}/>
            <Capability title="Branding" items={[
              "Naming & Identity",
              "Packaging & Guidelines",
              "Art Direction",
              "Collateral & Toolkits"
            ]}/>
            <Capability title="Content Creation" items={[
              "Social Media Content",
              "Directing + Filming",
              "Editing + Post",
              "Full Production"
            ]}/>
            <Capability title="Growth + PR" items={[
              "Celebrity Seeding",
              "Influencer Partnerships",
              "Social Media Management",
              "Strategic Collaborations",
              "Full-event production"
            ]}/>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="border-t h-screen flex items-center">
        <div className="max-w-5xl mx-auto px-4 md:px-6 w-full text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-8">
            Let&apos;s create moments that leave a mark
          </h2>
          <Button asChild size="lg" className="rounded-full">
            <a href="mailto:contact@club86.agency">Let&apos;s Talk</a>
          </Button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12">
            {/* About Us */}
            <div>
              <h3 className="text-lg font-semibold mb-4">About Us</h3>
              <div className="text-sm text-muted-foreground space-y-4">
                <p>
                  Club86 is a creative agency building cultural moments for the crypto industry. We specialize in event production, storytelling, and brand strategy for leading projects, exchanges, and communities across web3.
                </p>
                <p>
                  From large-scale conferences and private gatherings to curated brand activations, we connect people, products, and ideas through immersive experiences. Our team blends marketing strategy with cultural insight to help brands stand out, scale authentically, and create lasting impact both online and IRL.
                </p>
                <p>
                  At Club86, we turn crypto into culture, one event, one story, and one connection at a time
                </p>
              </div>
            </div>
            
            {/* Contact Us */}
            <div className="text-left md:text-right">
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <div className="text-sm text-muted-foreground">
                <a href="mailto:contact@club86.agency" className="hover:opacity-80">contact@club86.agency</a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t pt-8">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Club86. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

