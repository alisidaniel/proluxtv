export interface LandingContent {
    headerTitle: string;
    headerSubtitle: string;
    actions: {
        cta1: string;
    };
    primaryFeatures: {
        title: string;
        subtitle: string;
        image: string;
    }[];
    secondaryFeatures: {
        title: string;
        subtitle: string;
        description: string;
        image: string;
    }[];
}
