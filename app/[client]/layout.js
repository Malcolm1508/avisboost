export async function generateMetadata({ params }) {
  const { client } = await params;
  return {
    manifest: `/api/manifest/${client}`,
  };
}

export default function ClientLayout({ children }) {
  return children;
}
