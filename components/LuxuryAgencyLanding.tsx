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
  const stickyStartY = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollContent = scrollContentRef.current;
    
    if (!container || !scrollContent) return;

    let isLocked = false;
    let scrollPosition = 0;
    let virtualScroll = 0;
    let maxVirtualScroll = 0;

    const lockScroll = () => {
      if (isLocked) return;
      scrollPosition = window.scrollY;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition}px`;
      document.body.style.width = '100%';
      isLocked = true;
    };

    const unlockScroll = () => {
      if (!isLocked) return;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollPosition);
      isLocked = false;
      virtualScroll = 0;
    };

    const updateLayout = () => {
      // Calculate the total width needed to scroll through all images
      const totalWidth = scrollContent.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxHorizontalScroll = Math.max(0, totalWidth - viewportWidth);
      
      // Set container height to allow scrolling through all images
      // The height determines how much vertical scroll is needed to go through all images horizontally
      // This creates the "locked" effect - scroll down to scroll images horizontally
      // Make sure the height is sufficient to scroll through all images
      const containerHeight = Math.max(maxHorizontalScroll * 1.2, viewportWidth * 2);
      container.style.height = `${containerHeight}px`;
      maxVirtualScroll = containerHeight;
    };

    // Wait for images to load
    const updateAfterImagesLoad = () => {
      const images = scrollContent.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = images.length;

      if (totalImages === 0) {
        updateLayout();
        return;
      }

      const checkAllLoaded = () => {
        loadedCount++;
        if (loadedCount === totalImages) {
          updateLayout();
        }
      };

      images.forEach((img: HTMLImageElement) => {
        if (img.complete) {
          checkAllLoaded();
        } else {
          img.addEventListener('load', checkAllLoaded);
          img.addEventListener('error', checkAllLoaded);
        }
      });
    };

    updateAfterImagesLoad();
    updateLayout(); // Initial calculation

    const handleResize = () => {
      stickyStartY.current = null;
      updateLayout();
    };

    window.addEventListener('resize', handleResize);

    const updateHorizontalPosition = (progress: number) => {
      if (!scrollContent) return;
      const totalWidth = scrollContent.scrollWidth;
      const viewportWidth = window.innerWidth;
      const maxScroll = Math.max(0, totalWidth - viewportWidth);
      const horizontalPosition = progress * maxScroll;
      scrollContent.style.transform = `translateX(-${horizontalPosition}px)`;
    };

    const handleWheel = (e: WheelEvent) => {
      if (!container || !scrollContent) return;
      
      const rect = container.getBoundingClientRect();
      const isPinned = rect.top <= 0 && rect.bottom > 0;

      if (isPinned) {
        // Lock scroll if not already locked
        if (!isLocked) {
          lockScroll();
          virtualScroll = 0;
        }
        
        e.preventDefault();
        virtualScroll += e.deltaY;
        virtualScroll = Math.max(0, Math.min(virtualScroll, maxVirtualScroll));
        
        // Calculate progress based on virtual scroll
        const progress = maxVirtualScroll > 0 ? virtualScroll / maxVirtualScroll : 0;
        updateHorizontalPosition(progress);
      }
    };

    const handleScroll = () => {
      if (!container || !scrollContent) return;

      const rect = container.getBoundingClientRect();
      const containerTop = rect.top;
      const containerBottom = rect.bottom;
      const containerHeight = container.offsetHeight;

      // Check if we're in the pinned section (sticky at top)
      const isPinned = containerTop <= 0 && containerBottom > 0;

      if (isPinned) {
        // Lock vertical scroll when section is pinned
        if (!isLocked) {
          lockScroll();
          virtualScroll = 0; // Reset virtual scroll when entering pinned state
        }
      } else {
        // Unlock vertical scroll when section is not pinned
        if (isLocked) {
          unlockScroll();
        }

        // Reset when not pinned
        stickyStartY.current = null;
        
        if (containerTop > 0) {
          // Before section - show first image
          updateHorizontalPosition(0);
        } else if (containerBottom <= 0) {
          // After section - show last image
          updateHorizontalPosition(1);
        }
      }
    };

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          handleScroll();
          rafId = null;
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: false });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('wheel', handleWheel);
      if (isLocked) {
        unlockScroll();
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [images.length]);

  return (
    <section 
      id="about" 
      className="overflow-hidden relative"
      ref={containerRef}
    >
      <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-background">
        <div 
          className="flex gap-4 md:gap-6 will-change-transform pl-4 md:pl-6"
          ref={scrollContentRef}
          style={{ width: 'max-content' }}
        >
          {images.map((img, index) => (
            <div 
              key={index} 
              className="relative w-[85vw] md:w-[70vw] h-[85vh] md:h-[90vh] flex-shrink-0"
            >
              <Image
                src={img}
                alt={`Gallery image ${index + 1}`}
                fill
                className="object-cover rounded-lg"
                sizes="(max-width: 768px) 85vw, 70vw"
                priority={index < 2}
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
      <section id="services" className="border-t">
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

      {/* CTA BANNER */}
      <section className="border-t bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Times‑Square‑worthy stories, performance‑grade growth.</h3>
            <p className="text-muted-foreground mt-2">Tell us your objectives—brand, product, launch, or revenue—and we&apos;ll propose a right‑sized plan in 48 hours.</p>
          </div>
          <Button asChild size="lg" className="rounded-full">
            <a href="#contact">Request proposal</a>
          </Button>
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

