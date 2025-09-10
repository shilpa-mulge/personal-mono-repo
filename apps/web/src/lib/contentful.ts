const SPACE_ID = process.env.CONTENTFUL_SPACE_ID!;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || "master";
const TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN!;


const ENDPOINT = `https://cdn.contentful.com/spaces/${SPACE_ID}/environments/${ENVIRONMENT}`;

export async function fetchAllEntries() {
  const [configRes, dataRes] = await Promise.all([
    fetch(`${ENDPOINT}/entries?content_type=configuartions`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }),
    fetch(`${ENDPOINT}/entries?content_type=data`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    }),
  ]);

  if (!configRes.ok || !dataRes.ok) {
    throw new Error("Failed to fetch from Contentful");
  }

  const configs = await configRes.json();
  const datas = await dataRes.json();

  const configMap = configs.items.map((c: any) => ({
    id: c.sys.id,
    type: c.fields.type,
    data: c.fields.data,
  }));

  const dataMap = datas.items.map((d: any) => ({
    id: d.sys.id,
    type: d.fields.type,
    configId: d.fields.configId,
    data: d.fields.data,
  }));
  console.log("datasdatasdatasdatasdatas", configs, datas, configMap, dataMap)
  const pages = configMap
    .filter((cfg) => cfg.type === "Page" && cfg.data?.data?.slug)
    .map((cfg) => {
      const pageData = dataMap.find((d) => d.configId === cfg.id);
      return { config: cfg, data: pageData };
    })
    .filter((p) => !!p.data);
  console.log("pages", pages)
  return pages;
}

export async function getPageBySlug(slug: string) {
  const pages = await fetchAllEntries();
  return pages.find((p) => p.config.data.data.slug === slug);
}
