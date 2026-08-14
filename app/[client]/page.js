import { cookies } from "next/headers";
import { getClient, getTaps, getDailyTaps, getReviews, getPlan, getDailyRange } from "@/lib/db";
import { verifySession, cookieName } from "@/lib/auth";
import Responder from "./Responder";
import Analyzer from "./Analyzer";
import Login from "./Login";
import CountUp from "./CountUp";
import ReviewUpdate from "./ReviewUpdate";
import Plan from "./Plan";
import PostVisual from "./PostVisual";
import Activity from "./Activity";

export const dynamic = "force-dynamic";

export default async function Dashboard({ params }) {
  const { client } = await params;
  const c = await getClient(client);

  if (!c) {
    return (
      <div className="hero"><div className="hero-inner">
        <div className="eyebrow"><span className="dot"></span>BoostRepu</div>
        <h1 className="hero-title">Tableau de bord introuvable</h1>
        <p className="hero-sub">Aucun établissement ne correspond à « {client} ».</p>
      </div></div>
    );
  }

  const jar = await cookies();
  const token = jar.get(cookieName(client))?.value;
  if (!verifySession(token, client)) {
    return <Login client={client} name={c.name} />;
  }

  const taps = await getTaps(client);
  const daily = await getDailyTaps(client, 14);
  const week = daily.slice(-7).reduce((s, d) => s + d.value, 0);
  const today = daily.length ? daily[daily.length - 1].value : 0;
  const initial = (c.name || "?").trim().charAt(0).toUpperCase();

  const rev = await getReviews(client);
  const plan = await getPlan(client);
  const history = await getDailyRange(client, 365);
  let generated = 0, scansSince = 0, conversion = null;
  if (rev) {
    generated = Math.max(0, rev.current - rev.base);
    scansSince = Math.max(0, taps - rev.tapsAtBase);
    conversion = scansSince > 0 ? Math.min(100, Math.round((generated / scansSince) * 100)) : null;
  }

  return (
    <>
      <div className="hero">
        <div className="hero-inner hero-brand">
          <div className="brand-logo">
            {c.logoUrl
              ? <img src={c.logoUrl} alt={c.name} />
