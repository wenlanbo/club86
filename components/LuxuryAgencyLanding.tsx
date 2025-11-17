"use client"

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn, X } from "lucide-react";
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
      <CardTitle className="text-xl font-light">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {items.map((x, i) => (
          <li key={i} className="text-sm font-light">{x}</li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// Polaroid-style gallery component with draggable gadgets and zoom
const PolaroidGallery: React.FC<{ images: any[] }> = ({ images }) => {
  const [zoomedImage, setZoomedImage] = React.useState<number | null>(null);
  const [positions, setPositions] = React.useState<Array<{ x: number; y: number; rotation: number }>>([]);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRefs = useRef<Array<{ isDragging: boolean; startX: number; startY: number; element: HTMLDivElement | null }>>([]);
  const positionsRef = useRef<Array<{ x: number; y: number; rotation: number }>>([]);

  // Initialize positions scattered around center with random rotation
  useEffect(() => {
    if (positions.length === 0 && containerRef.current) {
      const container = containerRef.current;
      const containerWidth = container.offsetWidth || window.innerWidth;
      const containerHeight = container.offsetHeight || window.innerHeight;
      
      // Calculate center of container
      const centerX = containerWidth / 2;
      const centerY = containerHeight / 2;
      // Scatter radius - more horizontal, less vertical
      const scatterRadiusX = containerWidth * 0.9; // 90% of width for horizontal scatter
      const scatterRadiusY = containerHeight * 0.4; // 40% of height for vertical scatter
      // Gadget size (30% bigger: 280*1.3=364, 320*1.3=416)
      const gadgetWidth = 416;
      const gadgetHeight = 480;
      
      const initialPositions = images.map(() => {
        // More horizontal spread, less vertical spread
        const offsetX = (Math.random() - 0.5) * scatterRadiusX;
        const offsetY = (Math.random() - 0.5) * scatterRadiusY;
        
        // Random rotation between -15 and +15 degrees
        const randomRotation = (Math.random() - 0.5) * 30;
        
        // Calculate position centered around center
        const x = centerX + offsetX - gadgetWidth / 2;
        const y = centerY + offsetY - gadgetHeight / 2;
        
        return {
          x: Math.max(20, Math.min(x, containerWidth - gadgetWidth)),
          y: Math.max(50, Math.min(y, containerHeight - gadgetHeight)),
          rotation: randomRotation,
        };
      });
      setPositions(initialPositions);
      positionsRef.current = initialPositions;
      dragRefs.current = images.map(() => ({
        isDragging: false,
        startX: 0,
        startY: 0,
        element: null,
      }));
    }
  }, [images.length, positions.length]);
  
  // Keep positionsRef in sync with positions state
  useEffect(() => {
    positionsRef.current = positions;
  }, [positions]);

  const handleStartDrag = (index: number, clientX: number, clientY: number, element: HTMLDivElement) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    
    // Get current position from ref (always up-to-date)
    const currentPos = positionsRef.current[index] || { x: 0, y: 0, rotation: 0 };
    
    // Calculate offset from the click position relative to the element's actual position
    // Use the element's current position (x, y) from ref, not bounding rect
    const offsetX = clientX - containerRect.left - currentPos.x;
    const offsetY = clientY - containerRect.top - currentPos.y;

    dragRefs.current[index] = {
      isDragging: true,
      startX: offsetX,
      startY: offsetY,
      element,
    };
    
    // Set this photo as the top layer
    setDraggedIndex(index);

    const handleMove = (moveX: number, moveY: number) => {
      if (!dragRefs.current[index].isDragging || !containerRect) return;
      
      // Calculate new position based on mouse position minus the offset
      const newX = moveX - containerRect.left - dragRefs.current[index].startX;
      const newY = moveY - containerRect.top - dragRefs.current[index].startY;
      
      // Gadget size (30% bigger)
      const gadgetWidth = 416;
      const gadgetHeight = 480;
      
      // Constrain to container bounds
      const constrainedX = Math.max(0, Math.min(newX, containerRect.width - gadgetWidth));
      const constrainedY = Math.max(0, Math.min(newY, containerRect.height - gadgetHeight));
      
      setPositions(prev => {
        const newPositions = [...prev];
        if (newPositions[index]) {
          newPositions[index] = { ...newPositions[index], x: constrainedX, y: constrainedY };
        }
        // Update ref immediately for next drag calculation
        positionsRef.current = newPositions;
        return newPositions;
      });
    };

    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleEnd = () => {
      dragRefs.current[index].isDragging = false;
      setDraggedIndex(null); // Clear top layer when dragging ends
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
  };

  const handleMouseDown = (index: number, e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleStartDrag(index, e.clientX, e.clientY, e.currentTarget);
  };

  const handleTouchStart = (index: number, e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleStartDrag(index, e.touches[0].clientX, e.touches[0].clientY, e.currentTarget);
    }
  };

  const handleZoom = (index: number) => {
    setZoomedImage(index);
    document.body.style.overflow = 'hidden';
  };

  const handleCloseZoom = () => {
    setZoomedImage(null);
    document.body.style.overflow = '';
  };

  // Handle ESC key to close zoom
  useEffect(() => {
    if (zoomedImage === null) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseZoom();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [zoomedImage]);

  return (
    <>
      <section 
        id="about" 
        className="relative min-h-screen bg-black py-20"
        ref={containerRef}
      >
        {/* Background text */}
        <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-white">Make Events Memorable</h3>
        </div>
        <div className="relative w-full h-full z-10" style={{ minHeight: '100vh' }}>
          {images.map((img, index) => {
            const position = positions[index] || { x: 0, y: 0, rotation: 0 };
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="absolute cursor-move touch-none group"
                style={{
                  left: `${position.x}px`,
                  top: `${position.y}px`,
                  transform: `rotate(${position.rotation}deg)`,
                  zIndex: draggedIndex === index ? 50 : 10 + index,
                }}
                onMouseDown={(e) => handleMouseDown(index, e)}
                onTouchStart={(e) => handleTouchStart(index, e)}
              >
                {/* Polaroid frame - 30% bigger */}
                <div className="bg-white p-4 md:p-5 shadow-2xl w-[364px] md:w-[416px] relative">
                  {/* Image area */}
                  <div className="relative w-full h-[364px] md:h-[416px] bg-gray-100 border border-gray-200">
                    <Image
                      src={img}
                      alt={`Gallery image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 364px, 416px"
                      priority={true}
                      loading="eager"
                    />
                    {/* Zoom button at bottom right of photo - only visible on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleZoom(index);
                      }}
                      onMouseDown={(e) => e.stopPropagation()}
                      onTouchStart={(e) => e.stopPropagation()}
                      className="absolute bottom-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-all backdrop-blur-sm z-10 opacity-0 group-hover:opacity-100"
                      aria-label="Zoom image"
                    >
                      <ZoomIn className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Full-screen zoom modal */}
      <AnimatePresence>
        {zoomedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center cursor-pointer"
            onClick={handleCloseZoom}
          >
            <div className="relative w-full h-full flex items-center justify-center p-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseZoom();
                }}
                className="absolute top-4 right-4 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full max-w-7xl max-h-[90vh]"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[zoomedImage]}
                  alt={`Zoomed image ${zoomedImage + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default function LuxuryAgencyLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="font-thin tracking-tight">Club86</div>
          <Button asChild size="sm" className="bg-transparent hover:bg-transparent text-black border-0 shadow-none">
            <a href="mailto:contact@club86.agency">Let&apos;s Talk</a>
          </Button>
        </div>
      </header>

      {/* VIDEO SECTION WITH TEXT OVERLAY - FIRST SECTION */}
      <section id="work" className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
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
        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="max-w-7xl mx-auto px-4 md:px-6 w-full text-center">
            <motion.h1 
              initial={{opacity:0, y:10}} 
              animate={{opacity:1, y:0}} 
              transition={{delay:0.1}} 
              className="text-4xl md:text-6xl lg:text-7xl font-thin leading-[1.05] text-white"
            >
              We create lasting narratives
            </motion.h1>
            <motion.div 
              initial={{opacity:0, y:10}} 
              animate={{opacity:1, y:0}} 
              transition={{delay:0.15}} 
              className="mt-6 text-base md:text-lg text-white/90 max-w-2xl mx-auto space-y-4"
            >
              <p>An agency specializing in experiential marketing, storytelling, and event curation. We partner with leading brands to design experiences that captivate audiences and shape lasting connections.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="services" className="border-t bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <h2 className="text-3xl md:text-5xl font-thin leading-tight mb-12 text-left">
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

      {/* POLAROID GALLERY */}
      <PolaroidGallery images={images} />

      {/* FOOTER */}
      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-24 md:py-36">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mb-12">
            {/* About Us */}
            <div>
              <h3 className="text-lg font-thin mb-4">About Us</h3>
              <div className="text-sm text-muted-foreground space-y-4">
                <p>
                  Club86 is a creative agency building cultural moments for the crypto industry. We specialize in event production, storytelling, and brand strategy for leading projects, exchanges, and communities across web3.
                </p>
                <p>
                  With access to private members' clubs across New York—including well-known destinations and under-the-radar creative spaces for designers, founders, and influential voices—we create experiences that feel both exclusive and deeply connected to the culture.
                </p>
                <p>
                  From large-scale conferences and private gatherings to curated brand activations, we connect people, products, and ideas through immersive experiences. Our team blends marketing strategy with cultural insight to help brands stand out, scale authentically, and create lasting impact both online and IRL.
                </p>
                <p>
                  At Club86, we turn crypto into culture, one event, one story, and one connection at a time.
                </p>
              </div>
            </div>
            
            {/* Contact Us */}
            <div className="text-left md:text-right">
              <h3 className="text-lg font-thin mb-4">Contact Us</h3>
              <div className="text-sm text-muted-foreground">
                <a href="mailto:contact@club86.agency" className="hover:opacity-80">contact@club86.agency</a>
              </div>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="border-t pt-8">
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <div>
                © {new Date().getFullYear()} Club86. All rights reserved.
              </div>
              <div className="opacity-5 hover:opacity-20 transition-opacity text-xs">
                Powered by{' '}
                <a 
                  href="https://x.com/wenlanbo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-100"
                >
                  @wenlanbo
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

