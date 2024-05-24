import { EventInput } from '@fullcalendar/core';

export interface EventsState {
    events: EventInput[];
}

export interface EventsRequest {
    start: string;
    end: string;
    pipeMoment: Function;
}


export interface ContentfulEvent {
    metadata: Metadata;
    sys: ImageSys;
    fields: ContentfulEventFields;
}

export interface ContentfulEventFields {
    title: string;
    image: FieldsImage;
    startDateTime: string;
    endDateTime: string;
    description: string;
    audience: string[];
}

export interface FieldsImage {
    metadata: Metadata;
    sys: ImageSys;
    fields: ImageFields;
}

export interface ImageFields {
    title: string;
    description: string;
    file: File;
}

export interface File {
    url: string;
    details: Details;
    fileName: string;
    contentType: string;
}

export interface Details {
    size: number;
    image: DetailsImage;
}

export interface DetailsImage {
    width: number;
    height: number;
}

export interface Metadata {
    tags: any[];
}

export interface ImageSys {
    space: ContentType;
    id: string;
    type: string;
    createdAt: Date;
    updatedAt: Date;
    environment: ContentType;
    revision: number;
    locale: string;
    contentType?: ContentType;
}

export interface ContentType {
    sys: ContentTypeSys;
}

export interface ContentTypeSys {
    id: string;
    type: string;
    linkType: string;
}

