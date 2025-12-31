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
        authorRole: 'Supply Chain Analytics Firm',
        authorBio: 'Leading provider of advanced technology analysis and intellectual property services, specializing in microelectronics.',
        authorHistory: [
            '2024: Released comprehensive GPU supply chain report',
            '2023: Awarded "Best Data Provider" at Semicon West',
            '2020: Established dedicated AI-chip monitoring division',
            '20+ years analyzing semiconductor markets',
            'Data sourced from 50+ localized research teams in Asia, US, and Europe'
        ],
        authorCredibility: 'Data trusted by Fortune 500 tech companies including Apple, Nvidia, and Intel.',
        rating: 4.8,
        reviews: 124,
        updated: '2 days ago',
        updateFrequency: 'Weekly',
        tags: ['Supply Chain', 'Semiconductors', 'Tech', 'Hardware'],
        nodes: 5240,
        edges: 12150,
        features: [
            'Full tier-1 to tier-3 supplier mapping',
            'Geopolitical risk indicators for each node',
            'Production capacity data for major fabs',
            'Lead time historical trends'
        ],
        datasetStats: {
            entityTypes: 45,
            relationTypes: 12,
            dataSources: 150
        },
        imageSrc: semiconductorImg,
        ontologyImageSrc: semiconductorImg, // Reusing for demo
        reviewList: [
            { id: 1, user: 'Sarah Chen', role: 'Procurement Manager', rating: 5, date: '2 days ago', comment: 'Absolutely essential for our sourcing strategy. The tier-2 supplier mapping is incredibly detailed.' },
            { id: 2, user: 'Marcus Weber', role: 'Investment Analyst', rating: 4, date: '1 week ago', comment: 'Great data quality. Would love to see more frequent updates on pricing trends, but the structural data is solid.' },
            { id: 3, user: 'David Kim', role: 'Hardware Engineer', rating: 5, date: '2 weeks ago', comment: 'Saved us months of research time. The ontology is very intuitive to query.' }
        ]
    },
    {
        id: 'b2',
        title: 'Financial Fraud Patterns 2024',
        description: 'Updated ontology for detecting modern financial fraud patterns, including crypto-laundering schemes, synthetic identity fraud, and cross-border transaction anomalies. Essential for FinTech compliance teams.',
        price: 89.00,
        author: 'FinSec Lab',
        authorInitials: 'FS',
        authorRole: 'Financial Security Research Institute',
        authorBio: 'A collaborative research hub focusing on emerging threats in the digital finance space.',
        authorHistory: [
            'Founded by ex-FBI cyber division agents',
            'Key contributors to the SWIFT security framework updates',
            'Published "The State of DeFi Laundering" report (2023)',
            'Advisors to major European Central Banks'
        ],
        authorCredibility: 'Certified by ACAMS (Association of Certified Anti-Money Laundering Specialists).',
        rating: 4.9,
        reviews: 85,
        updated: '1 week ago',
        updateFrequency: 'Daily',
        tags: ['Finance', 'Fraud Detection', 'Security', 'Compliance'],
        nodes: 3100,
        edges: 8400,
        features: [
            'Real-time transaction anomaly patterns',
            'Crypto mixer address tagging',
            'Synthetic identity graph heuristics',
            'Sanctions list integration'
        ],
        datasetStats: {
            entityTypes: 30,
            relationTypes: 18,
            dataSources: 75
        },
        imageSrc: fraudImg,
        ontologyImageSrc: fraudImg,
        reviewList: [
            { id: 1, user: 'Alex Morgan', role: 'Compliance Officer', rating: 5, date: '3 days ago', comment: 'The synthetic identity patterns are spot on. Helped us catch a major ring last week.' },
            { id: 2, user: 'Priya Patel', role: 'Risk Analyst', rating: 5, date: '2 weeks ago', comment: 'Best ontology for graph databases I have used. Integration with Neo4j was seamless.' }
        ]
    },
    {
        id: 'b3',
        title: 'Rare Earth Elements Geopolitics',
        description: 'Detailed mapping of rare earth element mining, processing, and geopolitical dependencies. Tracks mine ownership, export quotas, and strategic reserves across major global powers.',
        price: 29.99,
        author: 'GeoStrat Analyst',
        authorInitials: 'GS',
        authorRole: 'Geopolitical Risk Consultancy',
        authorBio: 'Specialists in resource scarcity and international trade conflicts.',
        authorHistory: [
            'Advisors to energy ministries in G7 nations',
            'Regular contributors to Foreign Affairs magazine',
            'Track record of predicting 3 major export ban events',
            'Specialized in China-Africa resource relations'
        ],
        authorCredibility: 'Cited in multiple government defense white papers.',
        rating: 4.5,
        reviews: 42,
        updated: '3 days ago',
        updateFrequency: 'Monthly',
        tags: ['Geopolitics', 'Mining', 'Resources', 'Energy'],
        nodes: 1500,
        edges: 3200,
        features: [
            'Mine ownership structures & subsidiaries',
            'Processing facility locations & capacity',
            'Export restriction policies by country',
            'Alternative sourcing routes'
        ],
        datasetStats: {
            entityTypes: 25,
            relationTypes: 8,
            dataSources: 40
        },
        imageSrc: rareEarthImg,
        ontologyImageSrc: rareEarthImg,
        reviewList: [
            { id: 1, user: 'Dr. James Wilson', role: 'Policy Researcher', rating: 4, date: '1 month ago', comment: 'Very thorough on the ownership structures. Some processing capacity data feels slightly outdated.' },
            { id: 2, user: 'Elena Rodriguez', role: 'Supply Chain Strategist', rating: 5, date: '1 month ago', comment: 'Invaluable for our risk assessment. The geopolitical dependency map is an eye-opener.' }
        ]
    },
    {
        id: 'b4',
        title: 'Cybersecurity Threat Actors (APT)',
        description: 'Profiles of major Advanced Persistent Threat (APT) groups, their TTPs (Tactics, Techniques, and Procedures), and associated malware families. Based on MITRE ATT&CK framework.',
        price: 120.00,
        author: 'Cyber Threat Intel',
        authorInitials: 'CT',
        authorRole: 'Threat Intelligence Provider',
        authorBio: 'Curating actionable intelligence on state-sponsored and criminal hacking groups.',
        authorHistory: [
            'Team includes certified SANS instructors',
            'Former Red Team leads from top defense contractors',
            'Maintains one of the largest private malware zoos',
            'First to identify the "DarkCavalry" APT group'
        ],
        authorCredibility: 'Partnered with major endpoint security vendors.',
        rating: 5.0,
        reviews: 210,
        updated: '12 hours ago',
        updateFrequency: 'Hourly',
        tags: ['Cybersecurity', 'Threat Intel', 'APT', 'Malware'],
        nodes: 8900,
        edges: 25000,
        features: [
            'Mapped to MITRE ATT&CK v14',
            'IOCs (Indicators of Compromise) included',
            'Campaign timelines and attribution confidence',
            'Malware strain evolution graphs'
        ],
        datasetStats: {
            entityTypes: 60,
            relationTypes: 25,
            dataSources: 500
        },
        imageSrc: cyberImg,
        ontologyImageSrc: cyberImg,
        reviewList: [
            { id: 1, user: 'SecOps Lead', role: 'Enterprise Security', rating: 5, date: '4 hours ago', comment: 'The hourly updates are critical for us. Caught a C2 communication thanks to this feed.' },
            { id: 2, user: 'Malware Hunter', role: 'Independent Researcher', rating: 5, date: '1 day ago', comment: 'The depth of the TTP mapping is impressive. Worth every penny.' },
            { id: 3, user: 'CISO', role: 'Financial Services', rating: 5, date: '3 days ago', comment: 'Finally, a structured graph view of APTs instead of just flat PDF reports.' }
        ]
    },
    {
        id: 'b5',
        title: 'Biotech & Pharma Innovation Graph',
        description: 'Tracks emerging biotech startups, patent landscapes, and clinical trial results in mRNA technology and gene editing (CRISPR).',
        price: 75.00,
        author: 'BioTrend Watch',
        authorInitials: 'BT',
        authorRole: 'Life Sciences Market Research',
        authorBio: 'Tracking the pulse of innovation in pharmaceuticals and biotechnology.',
        authorHistory: [
            'Publishers of the "Annual Biotech Outlook" report',
            'Data team includes PhDs in Molecular Biology',
            '10 years tracking FDA approval pipelines',
            'Exclusive partnerships with patent data aggregators'
        ],
        authorCredibility: 'Data used by top VC firms in the life sciences sector.',
        rating: 4.7,
        reviews: 67,
        updated: '5 days ago',
        updateFrequency: 'Bi-weekly',
        tags: ['Biotech', 'Pharma', 'Healthcare', 'Innovation'],
        nodes: 4200,
        edges: 9800,
        features: [
            'Clinical trial phase tracking',
            'Patent citation networks',
            'VC funding rounds & investor connections',
            'Drug mechanism of action (MoA) linking'
        ],
        datasetStats: {
            entityTypes: 35,
            relationTypes: 15,
            dataSources: 90
        },
        imageSrc: biotechImg,
        ontologyImageSrc: biotechImg,
        reviewList: [
            { id: 1, user: 'Dr. Emily Chen', role: 'Venture Capitalist', rating: 5, date: '1 week ago', comment: 'The patent citation network helped us identify a key acquisition target.' },
            { id: 2, user: 'Pharma Scout', role: 'R&D', rating: 4, date: '2 weeks ago', comment: 'Great for tracking early-stage startups. Would like more coverage on European markets.' }
        ]
    },
    {
        id: 'b6',
        title: 'EV Battery Ecosystem',
        description: 'Complete ecosystem analysis of Electric Vehicle batteries, from lithium extraction to cell manufacturing and recycling. Includes major players like CATL, LG Energy Solution, and Tesla.',
        price: 39.99,
        author: 'Clean Energy Data',
        authorInitials: 'CE',
        authorRole: 'Renewable Energy Analysts',
        authorBio: 'Data-driven insights into the transition to green energy.',
        authorHistory: [
            'Partnered with major automotive OEMs',
            'Contributors to the IEA Global EV Outlook',
            'Specialists in battery chemistry supply chains',
            'Tracking gigafactory announcements since 2015'
        ],
        authorCredibility: 'Trusted by government energy departments.',
        rating: 4.6,
        reviews: 98,
        updated: '1 month ago',
        updateFrequency: 'Monthly',
        tags: ['EV', 'Batteries', 'Automotive', 'Energy'],
        nodes: 2800,
        edges: 6500,
        features: [
            'Gigafactory locations & planned capacity',
            'Chemistry types (LFP, NMC, NCA) tracking',
            'Recycling facility network',
            'Raw material contract flows'
        ],
        datasetStats: {
            entityTypes: 28,
            relationTypes: 10,
            dataSources: 60
        },
        imageSrc: null, // Empty case
        ontologyImageSrc: null,
        reviewList: [
            { id: 1, user: 'Auto Analyst', role: 'Market Research', rating: 5, date: '3 weeks ago', comment: 'The recycling facility network data is unique and hard to find elsewhere.' },
            { id: 2, user: 'Green Investor', role: 'Asset Management', rating: 4, date: '1 month ago', comment: 'Good overview, but needs faster updates on raw material spot prices.' }
        ]
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
                <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0 h-[85vh] flex flex-col">
                    {selectedBrain && (
                        <>
                            {/* Hero Section */}
                            <div className="h-48 shrink-0 relative bg-muted">
                                {selectedBrain.imageSrc ? (
                                    <>
                                        <img 
                                            src={selectedBrain.imageSrc} 
                                            alt={selectedBrain.title} 
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center bg-muted text-muted-foreground/50">
                                        <ImageIcon className="w-16 h-16 mb-2" />
                                    </div>
                                )}
                                <div className="absolute bottom-6 left-8 right-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Badge className="bg-primary hover:bg-primary text-primary-foreground border-none px-3 py-1">
                                            {selectedBrain.nodes.toLocaleString()} Nodes
                                        </Badge>
                                        <Badge variant="outline" className="bg-background/20 backdrop-blur text-foreground border-foreground/10 px-3 py-1">
                                            {selectedBrain.edges.toLocaleString()} Edges
                                        </Badge>
                                        <Badge variant="secondary" className="bg-background/80 backdrop-blur px-3 py-1">
                                            {selectedBrain.updateFrequency} Updates
                                        </Badge>
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground shadow-sm mb-1">{selectedBrain.title}</h2>
                                    <div className="flex items-center gap-4 text-muted-foreground text-sm">
                                        <span className="flex items-center gap-1.5">
                                            <User className="w-4 h-4" />
                                            {selectedBrain.author}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            {selectedBrain.rating} ({selectedBrain.reviews} reviews)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Content Tabs */}
                            <div className="flex-1 overflow-hidden flex flex-col bg-background">
                                <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                                    <div className="px-8 border-b border-border">
                                        <TabsList className="bg-transparent h-12 w-full justify-start gap-6 p-0">
                                            <TabsTrigger 
                                                value="overview" 
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium"
                                            >
                                                Overview
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="dataspecs" 
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium"
                                            >
                                                Data & Ontology
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="author" 
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium"
                                            >
                                                Author Info
                                            </TabsTrigger>
                                            <TabsTrigger 
                                                value="reviews" 
                                                className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 font-medium"
                                            >
                                                Reviews ({selectedBrain.reviews})
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-8">
                                        <TabsContent value="overview" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    About this Brain
                                                </h3>
                                                <p className="text-muted-foreground leading-relaxed text-base">
                                                    {selectedBrain.description}
                                                </p>
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {selectedBrain.tags.map(tag => (
                                                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                                                            #{tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    Key Features
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    {selectedBrain.features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                                            <span className="text-sm text-foreground/90">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="dataspecs" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                                            <div className="grid grid-cols-3 gap-4">
                                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
                                                    <div className="text-3xl font-bold text-primary mb-1">{selectedBrain.datasetStats.entityTypes}</div>
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Entity Types</div>
                                                </div>
                                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
                                                    <div className="text-3xl font-bold text-primary mb-1">{selectedBrain.datasetStats.relationTypes}</div>
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Relation Types</div>
                                                </div>
                                                <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
                                                    <div className="text-3xl font-bold text-primary mb-1">{selectedBrain.datasetStats.dataSources}</div>
                                                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Data Sources</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                                    Ontology Structure Preview
                                                </h3>
                                                <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-muted relative group">
                                                    {selectedBrain.ontologyImageSrc ? (
                                                        <img 
                                                            src={selectedBrain.ontologyImageSrc} 
                                                            alt="Ontology Structure" 
                                                            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                                            <Brain className="w-16 h-16 opacity-20 mb-4" />
                                                            <p>Ontology visualization not available</p>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                                                </div>
                                                <p className="text-sm text-muted-foreground italic">
                                                    * This is a visualization of the core ontology structure showing major entity classes and their relationships.
                                                </p>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="author" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                                            <div className="flex items-start gap-6">
                                                <Avatar className="w-20 h-20 border-2 border-primary/20">
                                                    <AvatarFallback className="text-2xl bg-primary/10 text-primary font-bold">
                                                        {selectedBrain.authorInitials}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-bold">{selectedBrain.author}</h3>
                                                    <Badge variant="secondary" className="font-normal">{selectedBrain.authorRole}</Badge>
                                                    <p className="text-muted-foreground leading-relaxed max-w-lg pt-2">
                                                        {selectedBrain.authorBio}
                                                    </p>
                                                    {selectedBrain.authorCredibility && (
                                                        <div className="flex items-center gap-2 text-sm text-primary font-medium mt-1">
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            {selectedBrain.authorCredibility}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <Separator />
                                            
                                            <div className="space-y-4">
                                                <h4 className="font-medium text-sm uppercase text-muted-foreground tracking-wider">History & Track Record</h4>
                                                <div className="grid gap-3">
                                                    {Array.isArray(selectedBrain.authorHistory) ? (
                                                        selectedBrain.authorHistory.map((history, idx) => (
                                                            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                                <p className="text-sm leading-relaxed text-foreground/90">{history}</p>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                                            <p className="text-sm leading-relaxed">{selectedBrain.authorHistory}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="reviews" className="m-0 animate-in fade-in-50 duration-300 space-y-6">
                                            {selectedBrain.reviewList && selectedBrain.reviewList.length > 0 ? (
                                                <div className="space-y-4">
                                                    {selectedBrain.reviewList.map((review) => (
                                                        <div key={review.id} className="p-4 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors">
                                                            <div className="flex items-start justify-between mb-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Avatar className="w-8 h-8">
                                                                        <AvatarFallback className="text-xs bg-primary/5 text-primary">
                                                                            {review.user.substring(0, 1)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                    <div>
                                                                        <div className="font-medium text-sm">{review.user}</div>
                                                                        <div className="text-xs text-muted-foreground">{review.role}</div>
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs font-medium bg-secondary/50 px-2 py-1 rounded">
                                                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                                    {review.rating}
                                                                </div>
                                                            </div>
                                                            <p className="text-sm text-muted-foreground leading-relaxed pl-10">
                                                                "{review.comment}"
                                                            </p>
                                                            <div className="text-xs text-muted-foreground/50 text-right mt-2">
                                                                {review.date}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground space-y-4">
                                                    <Star className="w-12 h-12 opacity-20" />
                                                    <p>Reviews will be available soon.</p>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </div>
                                </Tabs>

                                <DialogFooter className="p-6 border-t border-border bg-muted/5 mt-auto shrink-0 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4 mr-auto">
                                        <div className="text-3xl font-bold text-primary">${selectedBrain.price}</div>
                                        <span className="text-sm text-muted-foreground">/ month</span>
                                    </div>
                                    <div className="flex gap-3 w-full sm:w-auto">
                                        <Button variant="outline" size="lg" onClick={() => setSelectedBrain(null)}>Close</Button>
                                        <Button size="lg" className="gap-2 px-8">
                                            Subscribe Now
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </Layout>
    );
}
