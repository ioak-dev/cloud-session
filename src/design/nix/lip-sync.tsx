"use client";

import * as React from "react";

import { FilterSegment, FilterSet } from "@/components/ui/filter-segment";

import type { Candidate } from "./candidates";
import type { Mood } from "./rig/face";
import { NixFigure } from "./rig/NixFigure";
import { HEAD_VB } from "./rig/skeleton";
import { flapAt, pauseAfter, VISEMES, visemeAt, wordSeconds, words, wordVisemes, type Viseme } from "./rig/visemes";

/**
 * Lip-sync with Web Speech: a club member says one of its fixed lines, and its mouth follows.
 *
 * Web Speech reports when a line starts and ends, and a `boundary` as each word begins — no
 * phoneme timings, and its audio cannot be measured. So each word starts its mouth on its boundary
 * and plays shapes guessed from its letters over its estimated length (`rig/visemes.ts`). A voice
 * that reports no words gets the flap. With no voice at all (or Silent), the same words are timed
 * by estimate, so the sync can be judged without sound.
 *
 * The lines are fixed copy written for the demo. Nothing here speaks generated text.
 */

type Voice = { pitch: number; rate: number; prefer: string[] };

/** Each character's voice: a preference among the device's voices, a pitch and a rate. */
const VOICES: Record<string, Voice> = {
  "pond-marlowe": { pitch: 0.6, rate: 0.8, prefer: ["Daniel", "Arthur", "Google UK English Male", "Male"] },
  "pond-ines": { pitch: 1.2, rate: 1.15, prefer: ["Karen", "Moira", "Female"] },
  "pond-mina": { pitch: 1.55, rate: 1.05, prefer: ["Samantha", "Google US English", "Female"] },
  "pond-ollie": { pitch: 1.3, rate: 0.78, prefer: ["Victoria", "Female"] },
  "garden-bun": { pitch: 1.3, rate: 1.12, prefer: ["Samantha", "Karen", "Google US English", "Female"] },
  "garden-bean": { pitch: 1.6, rate: 0.82, prefer: ["Victoria", "Female"] },
  "obs-hob": { pitch: 0.7, rate: 0.88, prefer: ["Daniel", "Arthur", "Fred", "Google UK English Male", "Male"] },
  "obs-tavi": { pitch: 1.35, rate: 1.22, prefer: ["Samantha", "Karen", "Google US English", "Female"] },
  "obs-grit": { pitch: 0.45, rate: 0.82, prefer: ["Ralph", "Fred", "Male"] },
  "obs-lyra": { pitch: 1.15, rate: 1.0, prefer: ["Moira", "Tessa", "Google UK English Female", "Female"] },
  "obs-nox": { pitch: 0.85, rate: 0.84, prefer: ["Alex", "Aaron", "Male"] },
  "obs-pim": { pitch: 1.75, rate: 0.95, prefer: ["Victoria", "Female"] },
};

type Line = { text: string; mood: Mood; as?: string };

/** Fixed lines for the demo, one set per character. Lyra's last is in Hob's voice. */
const LINES: Record<string, Line[]> = {
  "pond-marlowe": [
    { text: "Patience. The answer is usually just below the surface.", mood: "neutral" },
    { text: "Not quite. Look again, slowly. There.", mood: "curious" },
  ],
  "pond-ines": [
    { text: "Ta-da! Now you try. Don't worry, I'll spot you.", mood: "delighted" },
    { text: "Ooh, wobbly landing. Shake it off and go again!", mood: "oops" },
  ],
  "pond-mina": [
    { text: "That was so good I can't stop giggling!", mood: "delighted" },
    { text: "Will you sit with me? Bean saved us a spot.", mood: "happy" },
  ],
  "pond-ollie": [
    { text: "Oh — hello. I'm new too. Can we go slowly?", mood: "worried" },
    { text: "I did it! I really, really did it.", mood: "delighted" },
  ],
  "garden-bun": [
    { text: "Right, everyone, listen up! Watering first, then questions.", mood: "focused" },
    { text: "Hmph. Fine. That one was very, very good.", mood: "happy" },
    { text: "Oh no. Oh no, no. Let's try that again — properly.", mood: "worried" },
  ],
  "garden-bean": [
    { text: "Is it snack time? It feels like snack time.", mood: "curious" },
    { text: "You did it! I'm so happy I could have a nap.", mood: "delighted" },
    { text: "Oopsie. That's all right. Mmm… one more go?", mood: "oops" },
  ],
  "obs-hob": [
    { text: "Welcome back to the hill. Mind the third step, it creaks.", mood: "happy" },
    { text: "Not quite. Have another look — closer. Closer still.", mood: "curious" },
    { text: "There it is. A new star, right where I said it would be.", mood: "delighted" },
  ],
  "obs-tavi": [
    { text: "Race you to the top! Last one up names the comet!", mood: "delighted" },
    { text: "Oops. Wrong one. I do that all the time — try again!", mood: "oops" },
  ],
  "obs-grit": [
    { text: "Hmph. I was not waiting for you. I was just sitting here.", mood: "neutral" },
    { text: "That was good. Very good. Don't tell the others I said so.", mood: "happy" },
  ],
  "obs-lyra": [
    { text: "Ladies and gentlemen, the moon! Please, hold your applause.", mood: "delighted" },
    { text: "Mind the third step, it creaks.", mood: "happy", as: "obs-hob" },
  ],
  "obs-nox": [
    { text: "Oh. It's you. Fine. You can sit there. Not there.", mood: "neutral" },
    { text: "Correct. I suppose that was impressive.", mood: "thinking" },
  ],
  "obs-pim": [
    { text: "Um, hello. I'm new too. Can I sit next to you?", mood: "worried" },
    { text: "You got it! I heard it from all the way over here.", mood: "happy" },
  ],
};

type Mode = "words" | "flap";
type Sound = "speech" | "silent";

function pickVoice(all: SpeechSynthesisVoice[], v: Voice, seed: number): SpeechSynthesisVoice | undefined {
  const en = all.filter((x) => x.lang.toLowerCase().startsWith("en"));
  const pool = en.length ? en : all;
  for (const p of v.prefer) {
    const hit = pool.find((x) => x.name.includes(p));
    if (hit) return hit;
  }
  return pool.length ? pool[seed % pool.length] : undefined;
}

/** The word now being said: its shapes and when it started, on the performance clock. */
type Current = { i: number; seq: Viseme[]; start: number; dur: number };

export function LipSyncDemo({ cast }: { cast: Candidate[] }) {
  const [id, setId] = React.useState(cast[0].id);
  const c = cast.find((x) => x.id === id) ?? cast[0];
  const lines = LINES[c.id] ?? [];
  const [li, setLi] = React.useState(0);
  const line = lines[Math.min(li, lines.length - 1)];
  const [mode, setMode] = React.useState<Mode>("words");
  const [sound, setSound] = React.useState<Sound>("speech");
  const [viseme, setViseme] = React.useState<Viseme | undefined>(undefined);
  const [word, setWord] = React.useState(-1);
  const [playing, setPlaying] = React.useState(false);
  const [note, setNote] = React.useState("");
  const [voices, setVoices] = React.useState<SpeechSynthesisVoice[]>([]);

  const run = React.useRef(0);
  const cur = React.useRef<Current | null>(null);
  const flapping = React.useRef(false);
  const t0 = React.useRef(0);

  const synth = typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis : null;

  React.useEffect(() => {
    if (!synth) return;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => synth.removeEventListener("voiceschanged", load);
  }, [synth]);

  const stop = React.useCallback(() => {
    run.current++;
    synth?.cancel();
    cur.current = null;
    flapping.current = false;
    setPlaying(false);
    setViseme(undefined);
    setWord(-1);
  }, [synth]);

  React.useEffect(() => stop, [stop, id, li]);

  const voiceOf = c.id && line ? VOICES[line.as ?? c.id] : undefined;
  const chosen = voiceOf && voices.length ? pickVoice(voices, voiceOf, cast.findIndex((x) => x.id === (line.as ?? c.id))) : undefined;

  const play = () => {
    if (!line || !voiceOf) return;
    stop();
    const me = ++run.current;
    const ws = words(line.text);
    const live = () => run.current === me;
    setPlaying(true);
    setNote("");

    /* one clock: every frame reads the word now being said and how far into it we are */
    const tick = () => {
      if (!live()) return;
      const now = performance.now() / 1000;
      let v: Viseme = "rest";
      if (flapping.current) v = flapAt(now - t0.current);
      else if (cur.current) v = visemeAt(cur.current.seq, cur.current.dur, now - cur.current.start);
      setViseme((p) => (p === v ? p : v));
      requestAnimationFrame(tick);
    };

    const startWord = (i: number) => {
      const w = ws[i];
      if (!w) return;
      cur.current = { i, seq: wordVisemes(w.word), start: performance.now() / 1000, dur: wordSeconds(w.word, voiceOf.rate) };
      setWord(i);
    };

    const finish = () => {
      if (!live()) return;
      run.current++;
      cur.current = null;
      flapping.current = false;
      setPlaying(false);
      setViseme(undefined);
      setWord(-1);
    };

    /* no voice, or Silent: the same words, timed by estimate */
    const timed = () => {
      let at = 0;
      ws.forEach((w, i) => {
        setTimeout(() => live() && startWord(i), at * 1000);
        at += wordSeconds(w.word, voiceOf.rate) + pauseAfter(w.word, voiceOf.rate);
      });
      setTimeout(finish, at * 1000 + 150);
    };

    t0.current = performance.now() / 1000;
    requestAnimationFrame(tick);

    const noVoice = sound === "speech" && (!synth || synth.getVoices().length === 0);
    if (sound === "silent" || noVoice) {
      if (noVoice) setNote("This browser has no voices: the words are timed by estimate, without sound.");
      if (mode === "flap") {
        flapping.current = true;
        const total = ws.reduce((a, w) => a + wordSeconds(w.word, voiceOf.rate) + pauseAfter(w.word, voiceOf.rate), 0);
        ws.forEach((w, i) => setTimeout(() => live() && setWord(i), (ws.slice(0, i).reduce((a, x) => a + wordSeconds(x.word, voiceOf.rate) + pauseAfter(x.word, voiceOf.rate), 0)) * 1000));
        setTimeout(finish, total * 1000);
      } else timed();
      return;
    }

    if (!synth) return;
    const u = new SpeechSynthesisUtterance(line.text);
    if (chosen) u.voice = chosen;
    u.pitch = voiceOf.pitch;
    u.rate = voiceOf.rate;
    let heard = false;
    let started = false;
    /* a voice that never starts (blocked, or busy): time the words instead */
    setTimeout(() => {
      if (live() && !started) {
        synth.cancel();
        setNote("The voice did not start, so the words are timed by estimate, without sound.");
        timed();
      }
    }, 1500);
    u.onstart = () => {
      if (!live()) return;
      started = true;
      t0.current = performance.now() / 1000;
      if (mode === "flap") flapping.current = true;
      /* a voice that reports no words falls back to the flap */
      setTimeout(() => {
        if (live() && !heard && mode === "words") {
          flapping.current = true;
          setNote("This voice reports no word timings, so the mouth flaps. Try another browser or voice.");
        }
      }, 700);
    };
    u.onboundary = (e) => {
      if (!live() || e.name !== "word") return;
      heard = true;
      const i = ws.findIndex((w) => e.charIndex >= w.at && e.charIndex < w.at + w.word.length);
      if (i < 0) return;
      if (mode === "flap") setWord(i);
      else {
        flapping.current = false;
        startWord(i);
      }
    };
    u.onend = finish;
    u.onerror = finish;
    synth.speak(u);
  };

  const ws = line ? words(line.text) : [];

  return (
    <section aria-labelledby="lip-sync" className="mt-10">
      <h2 id="lip-sync" className="material-heading text-lg text-foreground">
        Lip-sync — a fixed line, said with Web Speech
      </h2>
      <p className="material mt-1 max-w-[70ch] text-sm text-muted-foreground">
        Web Speech says when each word starts, not which sounds are in it, so each word starts on
        time and its mouth shapes are guessed from its letters, spread over its length. A voice that
        reports no words flaps instead. Silent times the same words by estimate, to judge the sync
        without sound. The line is real text beside the figure; every line here is fixed copy.
      </p>

      <div className="mt-3 flex flex-col gap-3">
        <FilterSet className="flex-wrap">
          {cast.map((x) => (
            <FilterSegment
              key={x.id}
              pressed={x.id === id}
              onClick={() => {
                setId(x.id);
                setLi(0);
              }}
            >
              {x.label}
            </FilterSegment>
          ))}
        </FilterSet>
        <div className="flex flex-wrap gap-3">
          <FilterSet>
            <FilterSegment pressed={mode === "words"} onClick={() => setMode("words")} title="Each word starts its mouth on time; shapes guessed from its letters">
              Word-synced
            </FilterSegment>
            <FilterSegment pressed={mode === "flap"} onClick={() => setMode("flap")} title="Opens and closes on a loop while it talks">
              Flap
            </FilterSegment>
          </FilterSet>
          <FilterSet>
            <FilterSegment pressed={sound === "speech"} onClick={() => setSound("speech")}>
              Web Speech
            </FilterSegment>
            <FilterSegment pressed={sound === "silent"} onClick={() => setSound("silent")}>
              Silent (timed)
            </FilterSegment>
          </FilterSet>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,23rem)_1fr]">
        {/* the head large, where the mouth can be judged, and the whole figure beside it */}
        <div className="flex items-end gap-2 rounded-[var(--radius-surface)] border border-border bg-card p-3">
          <NixFigure c={c} mood={playing ? line?.mood : undefined} viseme={viseme} viewBox={HEAD_VB} className="h-64 w-64 shrink-0" />
          <NixFigure c={c} mood={playing ? line?.mood : undefined} viseme={viseme} className="h-40 w-20 shrink-0" />
        </div>
        <div className="flex flex-col gap-3">
          <ol className="m-0 flex list-none flex-col gap-2 p-0">
            {lines.map((l, i) => (
              <li key={l.text}>
                <button
                  type="button"
                  aria-pressed={i === li}
                  onClick={() => setLi(i)}
                  className="w-full rounded-[var(--radius)] border border-border bg-card px-3 py-2 text-left text-sm aria-pressed:border-primary aria-pressed:ring-2 aria-pressed:ring-primary"
                >
                  {l.as && <span className="instrument mr-2 text-xs text-muted-foreground">In {cast.find((x) => x.id === l.as)?.label}'s voice</span>}
                  {l.text}
                </button>
              </li>
            ))}
          </ol>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={playing ? stop : play}
              className="filter-seg"
              aria-pressed={playing}
            >
              {playing ? "Stop" : "Say it"}
            </button>
            <span className="instrument text-xs text-muted-foreground">
              {sound === "silent" || !synth
                ? "No sound"
                : chosen
                  ? `${chosen.name} · pitch ${voiceOf?.pitch} · rate ${voiceOf?.rate}`
                  : "The device's default voice"}
            </span>
          </div>
          {/* the line as real text beside the figure, the word being said marked */}
          <p className="material m-0 text-lg text-foreground" aria-live="off">
            {ws.map((w, i) => (
              <React.Fragment key={w.at}>
                <span className={i === word ? "rounded bg-accent px-0.5 text-accent-foreground" : undefined}>{w.word}</span>{" "}
              </React.Fragment>
            ))}
          </p>
          {note && <p className="material m-0 text-sm text-muted-foreground">{note}</p>}
          <div className="flex flex-wrap gap-2">
            {VISEMES.map((v) => (
              <figure
                key={v.id}
                className={`m-0 flex flex-col items-center gap-1 rounded-[var(--radius)] p-1.5 ${viseme === v.id ? "bg-accent" : "bg-muted"}`}
              >
                <NixFigure c={c} still mood={line?.mood} viseme={v.id} viewBox={HEAD_VB} className="h-14 w-14" />
                <figcaption className="instrument text-[10px] text-muted-foreground">{v.title}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
