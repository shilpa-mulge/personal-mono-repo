import { createClient } from 'contentful';
import { createClient as createMgmtClient } from 'contentful-management';

export const contentfulClient = createClient({
    space: import.meta.env.VITE_CONTENTFUL_SPACE_ID!,
    accessToken: import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN!,
});

export const contentfulMgmtClient = createMgmtClient({
    accessToken: import.meta.env.VITE_CONTENTFUL_USER_TOKEN!,
});

export async function getEntriesByContentType(contentType: string) {
    const res = await contentfulClient.getEntries({ content_type: contentType });
    return res.items;
}

export async function getPageBySlug(slug: string) {
    const res = await contentfulClient.getEntries({
        content_type: "configuarations",
    });
    return res.items[0];
}

export async function updateEntry(entryId: string, fields: any) {
    const space = await contentfulMgmtClient.getSpace(import.meta.env.VITE_CONTENTFUL_SPACE_ID!);
    const env = await space.getEnvironment('master'); // or your env
    const entry = await env.getEntry(entryId);

    Object.keys(fields).forEach((field) => {
        entry.fields[field] = { 'en-US': fields[field] };
    });

    const updated = await entry.update();
    await updated.publish();
    return updated;
}
