export interface NewsState {
    myInterestsNews: any;
    coupons: any[];
    benefits: any[];
    currentPages: {};
    likes: any;
    rooms: string[];
    filters: FiltersI[];
    filterTags: FilterTagsI;
    loading: boolean;
}


// --- News -----------------------------
// export interface NewsI extends NewsBasicI, NewsAccordionI, NewsArticleI, NewsCarouselI {

// }

export interface NewsI {
    id: string;
    createdAt: string;
    updatedAt: string;
    title: string;
    audience: string[];
    contentType: string;
}

export interface NewsArticleI {
    description: string;
    image: string;
    category: string;
    geoSource: string;
}

export interface NewsAccordionI {
    entries: EntryAccordionI[];
    category: string;
    geoSource: string;
}

export interface NewsCarouselI {
    externalLink: string;
    images: ImagesCarouselI[];
    category: string;
    geoSource: string;
}

export interface EntryAccordionI {
    id: string;
    title: string; // key
    description: string; // value
}

export interface ImagesCarouselI {
    id: string;
    title: string;
    url: string;
    description: string;
}

export interface FilterListI {
    name: string;
}

export interface FiltersI {
    type: string;
    list: FilterListI[];
}

export interface FilterSelectedI {
    name: string;
    type: string;
}

// --- News END -----------------------------

export interface Like {
    id: string;
    reaction: number;
}

export interface Reaction {
    idcontent: string;
    likes: number;
    reacted: boolean;
}

export interface FilterTagsI {
    category: string[];
    geoSource: string[];
}

// --- MENU
export interface MenuI {
    headMenu:  string;
    active:    boolean;
    route:     string;
    subMenus?: SubMenuI[];
}

export interface SubMenuI {
    subtitleHead: string;
    subtitleList: SubtitleListI[];
}

export interface SubtitleListI {
    name:   string;
    active: boolean;
}


// --- PARAMS
export interface ParamsGetAllNewsI {
    newsType: string;
    page?: number;
    size?: number;
    geoSource?: string[];
    category?: string;
    orderByCreationDate?: string;
    orderByUpdateDate?: string;
}