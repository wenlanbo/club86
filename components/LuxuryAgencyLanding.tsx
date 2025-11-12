"use client"

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Play, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Simple utility for section titles
const SectionTitle: React.FC<{ overline?: string; title: string; subtitle?: string }> = ({ overline, title, subtitle }) => (
  <div className="max-w-3xl mx-auto text-center mb-12">
    {overline && (
      <p className="tracking-[0.2em] uppercase text-xs text-muted-foreground mb-3">{overline}</p>
    )}
    <h2 className="text-3xl md:text-5xl font-semibold leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground mt-4 text-base md:text-lg">{subtitle}</p>
    )}
  </div>
);

const Stat: React.FC<{ value: string; label: string; blurb?: string }> = ({ value, label, blurb }) => (
  <Card className="rounded-2xl shadow-sm">
    <CardContent className="p-6 md:p-8">
      <div className="text-4xl md:text-5xl font-bold mb-2">{value}</div>
      <div className="text-sm uppercase tracking-wide text-muted-foreground">{label}</div>
      {blurb && <p className="text-sm mt-3 text-muted-foreground">{blurb}</p>}
    </CardContent>
  </Card>
);

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

const WorkCard: React.FC<{title: string; tag: string; image?: string}> = ({ title, tag, image }) => (
  <Card className="group overflow-hidden rounded-2xl border-0 shadow-md bg-muted/10">
    <div className="aspect-[16/10] w-full bg-gradient-to-br from-muted to-background relative">
      {/* Placeholder image block */}
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={title} className="object-cover w-full h-full"/>
      ) : (
        <div className="absolute inset-0 grid place-items-center">
          <Play className="h-12 w-12"/>
        </div>
      )}
      <motion.div initial={{opacity:0}} whileHover={{opacity:1}} className="absolute inset-0 bg-black/40"/>
    </div>
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-xs text-muted-foreground mt-1">{tag}</p>
      </div>
      <Button variant="ghost" className="group-hover:translate-x-1 transition">
        View <ChevronRight className="ml-1 h-4 w-4"/>
      </Button>
    </CardHeader>
  </Card>
);

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

      {/* STATS */}
      <section id="about" className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <SectionTitle overline="How we work" title="Data-driven creatives, delivering exceptional outcomes." subtitle="We combine rigorous strategy with cinematic craft to unlock desire and conversion."/>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Stat value="18+" label="Years" blurb="Elevating iconic and emerging brands."/>
            <Stat value="50%" label="Analytical" blurb="Obsessed with insight, performance, and growth."/>
            <Stat value="50%" label="Creative" blurb="Art-direction veterans with film-grade craft."/>
            <Stat value="100%" label="Exceptional" blurb="Experts in excellence, globally."/>
          </div>
        </div>
      </section>

      {/* LATEST WORK */}
      <section id="work" className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <SectionTitle overline="Latest" title="Recent Work & Case Studies" subtitle="A rotating selection of campaigns, CGI, spatial builds, and product launches."/>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <WorkCard title="Marli New York" tag="CGI • Campaign"/>
            <WorkCard title="Perrier-Jouët" tag="Experiential • Video"/>
            <WorkCard title="Converse" tag="Content • Social"/>
            <WorkCard title="Alexander McQueen" tag="Editorial • Motion"/>
            <WorkCard title="Covergirl" tag="E‑commerce • Creative"/>
            <WorkCard title="8 Spruce" tag="Real Estate • Spatial"/>
          </div>
        </div>
      </section>

      {/* CAPABILITIES */}
      <section id="services" className="border-t">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
          <SectionTitle overline="Capabilities" title="Strategy, Branding, Content, Digital, PR + Events, Spatial" subtitle="One team across the full funnel—from POV to performance."/>

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
              "CGI / 3D Motion",
              "Editorial & Campaign",
              "E‑com Volume Production",
              "Directing, Filming, Post"
            ]}/>
            <Capability title="Digital Environments" items={[
              "Web Design & Build",
              "Shopify / Wordpress",
              "Responsive & Accessibility",
              "Email & CRM Templates"
            ]}/>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Our production model</AccordionTrigger>
              <AccordionContent>
                We streamline cross‑discipline production with modular scopes and transparent pricing—ideal for retained growth or fast campaign turnarounds.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Measurement & analytics</AccordionTrigger>
              <AccordionContent>
                From experiments to MMM, we connect creative to outcomes via live dashboards, eventing, and post‑mortems that inform the next sprint.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Industries we serve</AccordionTrigger>
              <AccordionContent>
                Beauty, fine jewelry, fashion, real estate, hospitality, aviation, and other luxury categories.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24">
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
            <div>
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

