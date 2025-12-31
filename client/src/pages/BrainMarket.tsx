import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { 
    Search, 
    Filter, 
    Brain, 
    Tag, 
    ShoppingCart, 
    Star, 
    Clock, 
    User, 
    ArrowRight,
    CheckCircle2,
    Calendar,
    Download,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

// Import Generated Images
import semiconductorImg from '@assets/generated_images/semiconductor_supply_chain_network.png';
import fraudImg from '@assets/generated_images/financial_fraud_detection_graph.png';
import rareEarthImg from '@assets/generated_images/rare_earth_mining_map.png';
import cyberImg from '@assets/generated_images/cybersecurity_threat_network.png';
import biotechImg from '@assets/generated_images/biotech_innovation_graph.png';

// Mock Data for Brains
const BRAINS = [
    {
        id: 'b1',
        title: 'Global Semiconductor Supply Chain',
        description: 'A comprehensive knowledge graph covering the entire semiconductor supply chain, from raw materials (silicon, neon gas) to manufacturing nodes (TSMC, Samsung, Intel) and end-user markets. Includes 5000+ entities and 12000+ relationships.',
        price: 49.99,
        author: 'TechInsights Pro',
        authorInitials: 'TI',
        rating: 4.8,
        reviews: 124,
        updated: '2 days ago',
        tags: ['Supply Chain', 'Semiconductors', 'Tech', 'Hardware'],
        nodes: 5240,
        edges: 12150,
        imageSrc: semiconductorImg
    },
    {
        id: 'b2',
        title: 'Financial Fraud Patterns 2024',
        description: 'Updated ontology for detecting modern financial fraud patterns, including crypto-laundering schemes, synthetic identity fraud, and cross-border transaction anomalies. Essential for FinTech compliance teams.',
        price: 89.00,
        author: 'FinSec Lab',
        authorInitials: 'FS',
        rating: 4.9,
        reviews: 85,
        updated: '1 week ago',
        tags: ['Finance', 'Fraud Detection', 'Security', 'Compliance'],
        nodes: 3100,
        edges: 8400,
        imageSrc: fraudImg
    },
    {
        id: 'b3',
        title: 'Rare Earth Elements Geopolitics',
        description: 'Detailed mapping of rare earth element mining, processing, and geopolitical dependencies. Tracks mine ownership, export quotas, and strategic reserves across major global powers.',
        price: 29.99,
        author: 'GeoStrat Analyst',
        authorInitials: 'GS',
        rating: 4.5,
        reviews: 42,
        updated: '3 days ago',
        tags: ['Geopolitics', 'Mining', 'Resources', 'Energy'],
        nodes: 1500,
        edges: 3200,
        imageSrc: rareEarthImg
    },
    {
        id: 'b4',
        title: 'Cybersecurity Threat Actors (APT)',
        description: 'Profiles of major Advanced Persistent Threat (APT) groups, their TTPs (Tactics, Techniques, and Procedures), and associated malware families. Based on MITRE ATT&CK framework.',
        price: 120.00,
        author: 'Cyber Threat Intel',
        authorInitials: 'CT',
        rating: 5.0,
        reviews: 210,
        updated: '12 hours ago',
        tags: ['Cybersecurity', 'Threat Intel', 'APT', 'Malware'],
        nodes: 8900,
        edges: 25000,
        imageSrc: cyberImg
    },
    {
        id: 'b5',
        title: 'Biotech & Pharma Innovation Graph',
        description: 'Tracks emerging biotech startups, patent landscapes, and clinical trial results in mRNA technology and gene editing (CRISPR).',
        price: 75.00,
        author: 'BioTrend Watch',
        authorInitials: 'BT',
        rating: 4.7,
        reviews: 67,
        updated: '5 days ago',
        tags: ['Biotech', 'Pharma', 'Healthcare', 'Innovation'],
        nodes: 4200,
        edges: 9800,
        imageSrc: biotechImg
    },
    {
        id: 'b6',
        title: 'EV Battery Ecosystem',
        description: 'Complete ecosystem analysis of Electric Vehicle batteries, from lithium extraction to cell manufacturing and recycling. Includes major players like CATL, LG Energy Solution, and Tesla.',
        price: 39.99,
        author: 'Clean Energy Data',
        authorInitials: 'CE',
        rating: 4.6,
        reviews: 98,
        updated: '1 month ago',
        tags: ['EV', 'Batteries', 'Automotive', 'Energy'],
        nodes: 2800,
        edges: 6500,
        imageSrc: null // Empty case
    }
];

export default function BrainMarket() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTab, setSelectedTab] = useState('all');
    const [selectedBrain, setSelectedBrain] = useState<typeof BRAINS[0] | null>(null);

    const filteredBrains = BRAINS.filter(brain => {
        const matchesSearch = brain.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              brain.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              brain.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesSearch;
    });

    return (
        <Layout>
            <div className="h-full flex flex-col bg-background">
                {/* Header */}
                <div className="border-b border-border bg-card/50 px-8 py-6 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                <Brain className="w-8 h-8 text-primary" />
                                Brain Market
                            </h1>
                            <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
                                Discover, subscribe, and integrate specialized knowledge graphs into your workflow. 
                                Accelerate your analysis with expert-curated ontologies and datasets.
                            </p>
                        </div>
                        <Button size="lg" className="gap-2 shadow-lg">
                            <ShoppingCart className="w-5 h-5" />
                            My Subscriptions
                        </Button>
                    </div>

                    {/* Search & Filter Bar */}
                    <div className="flex items-center gap-4 mt-4">
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input 
                                placeholder="Search for brains, topics, or authors..." 
                                className="pl-10 h-11 bg-background shadow-sm border-muted-foreground/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="h-11 gap-2 px-4">
                            <Filter className="w-4 h-4" />
                            Filters
                        </Button>
                        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="h-11">
                            <TabsList className="h-11 bg-muted/50">
                                <TabsTrigger value="all" className="h-9">All Brains</TabsTrigger>
                                <TabsTrigger value="popular" className="h-9">Popular</TabsTrigger>
                                <TabsTrigger value="new" className="h-9">New Arrivals</TabsTrigger>
                                <TabsTrigger value="free" className="h-9">Free</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {filteredBrains.map(brain => (
                            <Card key={brain.id} className="group hover:shadow-lg transition-all duration-300 border-border/60 hover:border-primary/50 flex flex-col overflow-hidden">
                                {/* Card Header Image Area */}
                                <div className="h-32 relative overflow-hidden bg-muted">
                                    {brain.imageSrc ? (
                                        <>
                                            <img 
                                                src={brain.imageSrc} 
                                                alt={brain.title} 
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground/50">
                                            <ImageIcon className="w-10 h-10 mb-2" />
                                            <span className="text-xs font-medium">No Preview</span>
                                        </div>
                                    )}
                                    
                                    <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end text-white z-10">
                                        <Badge variant="secondary" className="bg-black/40 backdrop-blur-md text-white border-white/10 hover:bg-black/60">
                                            {brain.nodes.toLocaleString()} Nodes
                                        </Badge>
                                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md text-xs font-medium border border-white/10">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            {brain.rating} ({brain.reviews})
                                        </div>
                                    </div>
                                </div>

                                <CardHeader className="pb-3 pt-4 px-5">
                                    <div className="flex justify-between items-start gap-2">
                                        <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                                            {brain.title}
                                        </CardTitle>
                                        <div className="text-lg font-bold text-primary whitespace-nowrap">
                                            ${brain.price}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                        <Avatar className="w-5 h-5">
                                            <AvatarFallback className="text-[9px] bg-primary/10 text-primary">{brain.authorInitials}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium text-foreground/80">{brain.author}</span>
                                        <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
                                        <span className="flex items-center gap-1 ml-auto">
                                            <Clock className="w-3 h-3" /> {brain.updated}
                                        </span>
                                    </div>
                                </CardHeader>

                                <CardContent className="px-5 py-2 flex-1">
                                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                                        {brain.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {brain.tags.map(tag => (
                                            <Badge key={tag} variant="outline" className="text-xs text-muted-foreground bg-muted/30 font-normal hover:bg-secondary hover:text-foreground transition-colors border-border/50">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </CardContent>

                                <Separator className="bg-border/50" />

                                <CardFooter className="px-5 py-4 bg-muted/10 flex justify-between items-center gap-3">
                                    <Button 
                                        variant="outline" 
                                        className="flex-1 text-xs h-9 border-primary/20 hover:bg-primary/5 hover:text-primary"
                                        onClick={() => setSelectedBrain(brain)}
                                    >
                                        Preview
                                    </Button>
                                    <Button className="flex-1 text-xs h-9 gap-2 shadow-sm">
                                        Subscribe
                                        <ArrowRight className="w-3 h-3" />
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredBrains.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                            <Search className="w-12 h-12 opacity-20 mb-4" />
                            <p className="text-lg font-medium">No brains found matching your search.</p>
                            <Button variant="link" onClick={() => setSearchQuery('')}>Clear search</Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Preview Dialog */}
            <Dialog open={!!selectedBrain} onOpenChange={(open) => !open && setSelectedBrain(null)}>
                <DialogContent className="max-w-2xl p-0 overflow-hidden gap-0">
                    {selectedBrain && (
                        <>
                            <div className="h-48 relative bg-muted">
                                {selectedBrain.imageSrc ? (
                                    <>
                                        <img 
                                            src={selectedBrain.imageSrc} 
                                            alt={selectedBrain.title} 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-80" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground/50">
                                        <ImageIcon className="w-16 h-16 mb-2" />
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-6 right-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none">
                                            {selectedBrain.nodes.toLocaleString()} Nodes
                                        </Badge>
                                        <Badge variant="outline" className="bg-black/40 backdrop-blur text-white border-white/20">
                                            {selectedBrain.edges.toLocaleString()} Edges
                                        </Badge>
                                    </div>
                                    <h2 className="text-2xl font-bold text-white shadow-sm">{selectedBrain.title}</h2>
                                </div>
                            </div>
                            
                            <div className="p-6 space-y-6">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="w-10 h-10 border border-border">
                                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{selectedBrain.authorInitials}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="font-medium">{selectedBrain.author}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                {selectedBrain.rating} ({selectedBrain.reviews} reviews)
                                                <span>•</span>
                                                Last updated {selectedBrain.updated}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-2xl font-bold text-primary">${selectedBrain.price}</div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-medium mb-2 text-sm uppercase text-muted-foreground tracking-wider">Description</h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {selectedBrain.description}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-medium mb-2 text-sm uppercase text-muted-foreground tracking-wider">Tags</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedBrain.tags.map(tag => (
                                                <Badge key={tag} variant="secondary" className="font-normal text-muted-foreground">
                                                    #{tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/50">
                                    <Button variant="outline" onClick={() => setSelectedBrain(null)}>Close</Button>
                                    <Button className="gap-2 w-full sm:w-auto">
                                        Subscribe Now
                                        <ArrowRight className="w-4 h-4" />
                                    </Button>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
