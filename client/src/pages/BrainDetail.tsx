import { Link, useRoute } from "wouter";
import Layout from "@/components/layout/Layout";
import { useLanguage } from "@/lib/i18n";
import { BRAINS } from "@/pages/BrainMarket";
import {
    ArrowLeft,
    ArrowRight,
    Brain,
    CheckCircle2,
    Image as ImageIcon,
    Star,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function BrainDetail() {
    const { t } = useLanguage();
    const [, params] = useRoute<{ id: string }>("/brain-market/:id");
    const brain = BRAINS.find((b) => b.id === params?.id);

    if (!brain) {
        return (
            <Layout>
                <div className="h-full flex flex-col items-center justify-center gap-4 bg-background">
                    <Brain className="w-16 h-16 opacity-20" />
                    <p className="text-lg text-muted-foreground" data-testid="text-brain-not-found">
                        Brain not found.
                    </p>
                    <Link href="/brain-market">
                        <Button variant="outline" className="gap-2" data-testid="button-back-to-market">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Brain Market
                        </Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="h-full flex flex-col bg-background overflow-y-auto">
                {/* Back navigation */}
                <div className="px-8 pt-6">
                    <Link href="/brain-market">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground hover:text-foreground"
                            data-testid="button-back-to-market"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Brain Market
                        </Button>
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="h-64 mx-8 mt-4 rounded-2xl shrink-0 relative bg-muted overflow-hidden">
                    {brain.imageSrc ? (
                        <>
                            <img
                                src={brain.imageSrc}
                                alt={brain.title}
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
                                {brain.nodes.toLocaleString()} {t("nodes")}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-background/20 backdrop-blur text-foreground border-foreground/10 px-3 py-1"
                            >
                                {brain.edges.toLocaleString()} {t("edges")}
                            </Badge>
                            <Badge variant="secondary" className="bg-background/80 backdrop-blur px-3 py-1">
                                {brain.updateFrequency} Updates
                            </Badge>
                        </div>
                        <h1
                            className="text-3xl font-bold text-foreground mb-1"
                            data-testid="text-brain-title"
                        >
                            {brain.title}
                        </h1>
                        <div className="flex items-center gap-4 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1.5">
                                <User className="w-4 h-4" />
                                {brain.author}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                {brain.rating} ({brain.reviews} {t("reviews")})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex-1 flex flex-col px-8 pt-6">
                    <Tabs defaultValue="overview" className="flex-1 flex flex-col">
                        <div className="border-b border-border">
                            <TabsList className="bg-transparent h-12 w-full justify-start gap-6 p-0">
                                <TabsTrigger
                                    value="overview"
                                    className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-medium"
                                    data-testid="tab-overview"
                                >
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="dataspecs"
                                    className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-medium"
                                    data-testid="tab-dataspecs"
                                >
                                    {t("datasetOverview")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="author"
                                    className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-medium"
                                    data-testid="tab-author"
                                >
                                    {t("aboutAuthor")}
                                </TabsTrigger>
                                <TabsTrigger
                                    value="reviews"
                                    className="h-12 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 font-medium"
                                    data-testid="tab-reviews"
                                >
                                    {t("reviews")} ({brain.reviews})
                                </TabsTrigger>
                            </TabsList>
                        </div>

                        <div className="flex-1 py-8 max-w-5xl">
                            <TabsContent value="overview" className="m-0 space-y-8 animate-in fade-in-50 duration-300">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">About this Brain</h3>
                                    <p className="text-muted-foreground leading-relaxed text-base">
                                        {brain.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {brain.tags.map((tag) => (
                                            <Badge key={tag} variant="secondary" className="px-3 py-1">
                                                #{tag}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">{t("keyFeatures")}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {brain.features.map((feature, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                                            >
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
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            {brain.datasetStats.entityTypes}
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("entityTypes")}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            {brain.datasetStats.relationTypes}
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("relationTypes")}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 text-center">
                                        <div className="text-3xl font-bold text-primary mb-1">
                                            {brain.datasetStats.dataSources}
                                        </div>
                                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("dataSources2")}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">
                                        {t("ontologyStructure")} {t("preview")}
                                    </h3>
                                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-muted relative group">
                                        {brain.ontologyImageSrc ? (
                                            <img
                                                src={brain.ontologyImageSrc}
                                                alt={t("ontologyStructure")}
                                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                                                <Brain className="w-16 h-16 opacity-20 mb-4" />
                                                <p>Ontology visualization not available</p>
                                            </div>
                                        )}
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
                                            {brain.authorInitials}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold" data-testid="text-author-name">
                                            {brain.author}
                                        </h3>
                                        <Badge variant="secondary" className="font-normal">
                                            {brain.authorRole}
                                        </Badge>
                                        <p className="text-muted-foreground leading-relaxed max-w-lg pt-2">
                                            {brain.authorBio}
                                        </p>
                                        {brain.authorCredibility && (
                                            <div className="flex items-center gap-2 text-sm text-primary font-medium mt-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                {brain.authorCredibility}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-4">
                                    <h4 className="font-medium text-sm uppercase text-muted-foreground tracking-wider">
                                        {t("authorHistory")}
                                    </h4>
                                    <div className="grid gap-3">
                                        {Array.isArray(brain.authorHistory) ? (
                                            brain.authorHistory.map((history, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                                    <p className="text-sm leading-relaxed text-foreground/90">
                                                        {history}
                                                    </p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
                                                <p className="text-sm leading-relaxed">{brain.authorHistory}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </TabsContent>

                            <TabsContent value="reviews" className="m-0 animate-in fade-in-50 duration-300 space-y-6">
                                {brain.reviewList && brain.reviewList.length > 0 ? (
                                    <div className="space-y-4">
                                        {brain.reviewList.map((review) => (
                                            <div
                                                key={review.id}
                                                className="p-4 rounded-lg border border-border/50 bg-muted/10 hover:bg-muted/30 transition-colors"
                                                data-testid={`review-${review.id}`}
                                            >
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
                </div>

                {/* Sticky Footer / CTA */}
                <div className="sticky bottom-0 border-t border-border bg-background/95 backdrop-blur px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-baseline gap-2">
                        <div className="text-3xl font-bold text-primary" data-testid="text-brain-price">
                            ${brain.price}
                        </div>
                        <span className="text-sm text-muted-foreground">/ month</span>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/brain-market">
                            <Button variant="outline" size="lg" data-testid="button-close-detail">
                                Close
                            </Button>
                        </Link>
                        <Button size="lg" className="gap-2 px-8" data-testid="button-subscribe-now">
                            Subscribe Now
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
