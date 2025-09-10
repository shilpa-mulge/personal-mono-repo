import PageRenderer from "../../components/PageRenderer";

export default async function Page({ params }: { params: { slug?: string[] } }) {
  // Convert array or undefined into a string slug
  const slug = params.slug?.length ? params.slug.join("/") : "/";

  console.log("Server slug:", slug);

  return <PageRenderer slug={slug} />;
}
