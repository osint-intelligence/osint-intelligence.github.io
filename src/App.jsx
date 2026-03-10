import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Treemap, LineChart, Line, Legend } from "recharts";

// ═══════════════════ THEME ═══════════════════
const T = { bg: "#030508", bg2: "#080c14", bg3: "#0e1520", bg4: "#161e2e", bdr: "#1a2436", red: "#ef4444", redDim: "#7f1d1d", text: "#8896a8", hi: "#dce4ec", dim: "#3e4c5e", acc: "#00d4ff", gold: "#c8a84e", font: "'Menlo','Consolas','Courier New',monospace" };

const DRIVE_URL = "https://drive.proton.me/urls/41JMYKWZ20#CqPRcFkS2cHS";

// ═══════════════════ V8 CHANGELOG ═══════════════════
// Added: DTH (Suspicious Deaths) cluster
// Added nodes: Justin Berry, Seth Rich, Shawn Lucas, Andrew Breitbart, Beranton Whisenant,
//   Matt Damon, Ben Affleck, Fabrizio Lombardo, Brian Peck, Corey Feldman, Kaya Jones,
//   Asia Argento, James O'Keefe, Edgar Welch, Jacob Schwartz, David Icke, Catherine Agnew,
//   Max Maccoby, Donna Brazile, Wade Rathke, Steve Pieczenik, Barbara Walters,
//   Suspicious Deaths Pattern concept node
// Added edges: 50+ new connections from markdown extraction
// Added timeline: 12 new events from markdown enrichment
// Added witnesses: Feldman, Argento, O'Keefe, Icke

// ═══════════════════ PART INDEX ═══════════════════
const PARTS_INDEX = {
  1:{t:"McCann Case / Podesta E-fits",d:"2016-12-04",pg:14},
  2:{t:"ACORN Controversy",d:"2017-01-03",pg:11},
  3:{t:"Obama ACORN Ties",d:"2017-01-05",pg:8},
  4:{t:"McCann E-fits / Amaral",d:"2017-01-09",pg:18},
  5:{t:"Gaspar Statements",d:"2017-01-12",pg:20},
  6:{t:"Yvonne Martin Testimony",d:"2017-01-14",pg:14},
  7:{t:"Conspiracy Research Advice",d:"2017-01-19",pg:4},
  8:{t:"Clement Freud Exposed",d:"2017-01-22",pg:16},
  9:{t:"Kate McCann Book / Freud",d:"2017-01-26",pg:22},
  10:{t:"Kate McCann Book Analysis",d:"2017-01-30",pg:24},
  11:{t:"National Pizza Day Coincidences",d:"2017-02-09",pg:12},
  12:{t:"FBI Pedophile Symbols",d:"2017-02-13",pg:18},
  13:{t:"NYT 2005 Investigation / Fake News",d:"2017-02-13",pg:32},
  14:{t:"Mindset & Tactics of Pedophiles / Heath",d:"2017-02-18",pg:28},
  15:{t:"Eichenwald Court Records",d:"2017-02-21",pg:20},
  16:{t:"Alex Jones / Bill Clinton Logic",d:"2017-02-25",pg:10},
  17:{t:"Eichenwald Above the Law / Brian Podesta",d:"2017-03-01",pg:24},
  18:{t:"Vault 7 / MI5 Blackmail",d:"2017-03-07",pg:30},
  19:{t:"Meme Warfare / DC Protest",d:"2017-03-08",pg:41},
  20:{t:"BLogo Origins / Alex Jones Apology / Trudeau",d:"2017-03-21",pg:40},
  21:{t:"GLogo Origins / Craig Sawyer",d:"2017-03-28",pg:70},
  22:{t:"CLogo Origins / Haiti / Clinton Foundation",d:"2017-04-05",pg:42},
  23:{t:"Pedophilia Normalization / Ronald Bernard",d:"2017-04-21",pg:37},
  24:{t:"Google Trends Manipulation / ANTIFA-NAMBLA / Comey",d:"2017-04-29",pg:23},
  25:{t:"McCann Continued / Palestine / Brenda Leyland",d:"2017-05-10",pg:58},
  26:{t:"Eichenwald Tentacle / BuzzFeed / Media Matters",d:"2017-06-15",pg:46},
  27:{t:"Spirit Cooking / Rothschild / Occult",d:"2017-07-01",pg:37},
  28:{t:"David Brock / William Grey / Blackmail",d:"2017-08-01",pg:72},
  29:{t:"WikiLeaks Assessment / Luzzatto Pool Email",d:"2017-09-01",pg:77},
  30:{t:"McCann Summary / Roger Stone / E-fit Timeline",d:"2017-10-01",pg:51},
  31:{t:"Hollywood Victims / Weinstein / Mind Control",d:"2017-10-06",pg:127},
  32:{t:"Luzzatto Blog / Reddit Ban / Final",d:"2017-12-30",pg:87},
};

// ═══════════════════ DATA ═══════════════════
const CL = {
  POD: { c: "#ef4444", l: "Podesta / Clinton", s: "Political operatives, campaign staff, and close associates" },
  MCC: { c: "#3b82f6", l: "McCann Case", s: "Individuals directly connected to the 2007 Madeleine McCann disappearance in Praia da Luz" },
  INT: { c: "#22c55e", l: "Intelligence / State", s: "Government agencies, intelligence services, and state actors with surveillance/blackmail capability" },
  MED: { c: "#eab308", l: "Media / Cover-Up", s: "Journalists, outlets, and platforms that either suppressed or distorted investigation" },
  PED: { c: "#a855f7", l: "Confirmed Pedophiles", s: "Individuals with confirmed convictions or credible multi-witness allegations" },
  WHI: { c: "#06b6d4", l: "Whistleblowers", s: "Investigators, witnesses, and individuals who exposed information at personal risk" },
  ORG: { c: "#78716c", l: "Organizations", s: "Institutions, foundations, and entities with structural roles in the network" },
  OCC: { c: "#f43f5e", l: "Occult / Symbolic", s: "Entities connected to ritualistic, symbolic, or occult elements in the dossier" },
  CON: { c: "#f59e0b", l: "Concepts / Patterns", s: "Systemic patterns, operations, and meta-concepts identified across the investigation" },
  DTH: { c: "#dc2626", l: "Suspicious Deaths", s: "Individuals who died under suspicious circumstances after possessing or pursuing compromising information" },
};

const EV = {
  CONFIRMED: { c: "#22c55e", l: "Confirmed", d: "Verified by court records, official documents, or public admissions" },
  HIGH: { c: "#3b82f6", l: "High", d: "Supported by primary sources (police files, sworn testimony, official reports)" },
  MODERATE: { c: "#eab308", l: "Moderate", d: "Based on credible secondary sources with some primary corroboration" },
  LOW: { c: "#f97316", l: "Low", d: "Circumstantial evidence, pattern-matching, or single-source claims" },
  UNVERIFIED: { c: "#ef4444", l: "Unverified", d: "Anonymous claims, speculation, or unconfirmed testimony" },
};

const N = [
  { id:"jp", l:"John Podesta", cl:"POD", x:420, y:220, sz:30, ev:"MODERATE", p:[1,4,7,17,29,30],
    tg:["emails","efits","mccann","coded-language","cap","wapo"],
    d:"Chairman of Hillary Clinton's 2016 presidential campaign. Former White House Chief of Staff to Bill Clinton (1998-2001). Counselor to President Obama. President, then Chair of Center for American Progress (CAP).",
    dt:"WIKILEAKS EMAILS: Over 50,000 emails released Oct-Nov 2016. Contain anomalous food-coded language ('pizza','hotdogs','pasta','walnut sauce') in contexts that do not appear to reference actual food. Multiple references to children in unusual framing. [Part 1, pg 3-6; Part 29, pg 8-15]\n\nMcCANN CONNECTION: E-fit images released by Scotland Yard in Oct 2013 bear striking visual resemblance to John Podesta. WikiLeaks archive shows NO emails between Nov 1, 2006 and May 4, 2007 — Madeleine McCann disappeared May 3, 2007. His assistant Elizabeth Cooley emailed on his behalf May 4, 2007, proving access to his account during the gap. [Part 1, pg 7-10; Part 4, pg 3-8; Part 7, pg 2]\n\nPOST-LEAK: Given a contributing columnist position at Washington Post on Feb 23, 2017 — rather than being investigated for email contents. In NewCo interview (Feb 2017), refused to address PizzaGate beyond repeating 'MSM debunked it'. [Part 17, pg 5-7]\n\nART: Office displayed oil painting on loan from brother Tony showing men with knives and forks over a man on a table. Quipped: 'It's better to be the guy with the fork than the guy on the table.' [Part 29, pg 20]" },

  { id:"tp", l:"Tony Podesta", cl:"POD", x:540, y:160, sz:24, ev:"MODERATE", p:[1,4,7,27,28],
    tg:["efits","art","mccann","lobbyist","podesta-group","spirit-cooking"],
    d:"American lobbyist. Founded the Podesta Group. Lobbied for Bank of America, BP, Egypt, and multiple political campaigns.",
    dt:"ART COLLECTION: Washington Post (Sep 2004) documented his collection: home tour visitors were 'horrified' by multiple color pictures of naked teenagers by Katy Grannan. Displays Louise Bourgeois' 'Arch of Hysteria' — identical to a Jeffrey Dahmer victim photograph. [Part 1, pg 8-9; Part 28, pg 12-15]\n\nMcCANN E-FITS: The second e-fit released by Scotland Yard in Oct 2013 bears resemblance to Tony Podesta, including the distinctive mole on his forehead. [Part 1, pg 10-11; Part 4, pg 5-7]\n\nSPIRIT COOKING: Directly invited by Marina Abramovic to a 'Spirit Cooking dinner' — WikiLeaks email. John Podesta was forwarded the invitation. [Part 27, pg 4-8]\n\nPODESTA GROUP: Dissolved in Nov 2017 amid Mueller investigation. [Part 28, pg 20-25]" },

  { id:"ja", l:"James Alefantis", cl:"POD", x:290, y:140, sz:22, ev:"MODERATE", p:[12,20,32],
    tg:["comet","symbols","brock","dc-power","instagram"],
    d:"Owner of Comet Ping Pong restaurant in Washington DC. Named GQ Magazine's 49th most powerful person in Washington DC.",
    dt:"COMET PING PONG: Logo contained imagery similar to FBI-documented pedophile symbols. 'CPP' abbreviation matches 'Child Pornography' abbreviation. Menu contained 'P.E.D.' notation. Nearby Besta Pizza had logo resembling FBI's BoyLover triangle-spiral — changed after scrutiny. [Part 12, pg 8-12; Part 20, pg 15-18]\n\nDAVID BROCK: Ex-boyfriend of Media Matters founder David Brock, creating direct link between Comet Ping Pong and Clinton-aligned media suppression apparatus. [Part 26, pg 10-12]\n\nALEX JONES: Jones issued a public apology and retraction — demonstrating significant legal/political power for a 'pizza shop owner'. Contrasts with Jones never being sued by Bill Clinton despite years of 'rapist' claims. [Part 16, pg 6-8; Part 20, pg 22-25]\n\nALLEGED SERVER: Titus Frost interview with alleged hacker who claimed to find 'Cheese Pizza' on CPP server. UNVERIFIED. [Part 32, pg 30-35]" },

  { id:"db", l:"David Brock", cl:"POD", x:190, y:210, sz:20, ev:"HIGH", p:[26,28],
    tg:["media-matters","blackmail","censorship","clinton","grey"],
    d:"Founder of Media Matters for America. Former conservative journalist turned Clinton-aligned media operative.",
    dt:"MEDIA MATTERS: Founded 2004. Functions as Clinton-aligned attack apparatus. Specifically targeted PizzaGate researchers. [Part 26, pg 15-20; Part 28, pg 5-10]\n\nBLACKMAIL LAWSUIT: Ex-partner William Grey filed lawsuit referencing an $850,000 payment — context strongly suggests blackmail over compromising material. Court documents heavily redacted. [Part 28, pg 25-35]\n\nHEART ATTACK: Anonymous poster claiming FBI affiliation predicted on March 6, 2017 that Brock would suffer a heart attack. Two weeks later (March 22), Brock did suffer a heart attack but survived. [Part 20, pg 30-32]\n\nALEFANTIS: Ex-boyfriend of James Alefantis — directly connects media suppression apparatus to Comet Ping Pong. [Part 26, pg 10-12]\n\nBUZZFEED: BuzzFeed used Media Matters framing to explicitly call for YouTube censorship of PizzaGate content. [Part 26, pg 25-30]" },

  { id:"tl", l:"Tamera Luzzatto", cl:"POD", x:530, y:300, sz:20, ev:"HIGH", p:[29,32],
    tg:["emails","children","blog","rockefeller","franken","evies-crib"],
    d:"Former Chief of Staff to Senator John D. Rockefeller IV.",
    dt:"POOL EMAIL: WikiLeaks Podesta email inviting recipients to a farm, stating children 'will be in that pool for sure' as 'further entertainment.' The phrasing of children as 'further entertainment' for adults is anomalous. [Part 29, pg 10-18]\n\nEVIE'S CRIB BLOG: Web archive captures reveal disturbing tags on infant content: 'Baby Ambien' (a sedative), 'Tranquilizers', 'Psychopath', 'Public Intoxication.' Applied to posts about babies. [Part 32, pg 40-55]\n\nAL FRANKEN: Luzzatto publicly praised Senator Al Franken, who resigned in Jan 2018 after multiple sexual assault accusations. [Part 32, pg 56-58]\n\nROCKEFELLER: Position as CoS to a Rockefeller places her at the highest levels of American political dynasty. [Part 29, pg 18-20]" },

  { id:"hc", l:"Hillary Clinton", cl:"POD", x:340, y:320, sz:26, ev:"LOW", p:[2,13,22,25],
    tg:["haiti","foundation","campaign","fake-news","palestine"],
    d:"2016 Presidential candidate. Former Secretary of State. Clinton Foundation co-chair.",
    dt:"CLINTON FOUNDATION HAITI: Foundation operated in Haiti post-2010 earthquake. UN peacekeepers simultaneously documented trafficking in the same region. Laura Silsby caught transporting 33 children without documentation — charges reduced after intervention. [Part 22, pg 10-20]\n\nFAKE NEWS NARRATIVE: Clinton's campaign aggressively promoted 'fake news' label specifically to counter PizzaGate. Google Search Trends show 'fake news' and 'pizzagate' rising simultaneously from Nov 2016. Philippe Reines tweeted at Flynn Jr: 'What goes around COMETS around. And given your pizza obsession... xo Philippe.' [Part 13, pg 28-32]\n\nPALESTINE: 2006 audio emerged of Clinton proposing to rig Palestinian elections. Zero MSM coverage — same media-silence pattern. [Part 25, pg 40-45]\n\nWELLESLEY SPEECH: May 2017 commencement address smeared those investigating high-level pedophilia without naming PizzaGate. [Part 25, pg 48-50]" },

  { id:"bc", l:"Bill Clinton", cl:"POD", x:200, y:340, sz:26, ev:"MODERATE", p:[2,3,16],
    tg:["epstein","acorn","rape","flights","haiti"],
    d:"42nd President of the United States. Extensive ties to Jeffrey Epstein.",
    dt:"JEFFREY EPSTEIN: Flight logs document Clinton on 26+ flights on Epstein's 'Lolita Express.' Some flights to Epstein's private island. [Part 16, pg 3-5]\n\nACORN: Close ties to ACORN, defunded after Project Veritas exposed employees assisting hypothetical child trafficking. [Part 2, pg 5-8]\n\nALEX JONES ANALYSIS: Jones called Clinton a rapist for years, sold t-shirts, ran $100K contest. Clinton never filed defamation suit despite clear standing if claims were false. Logical inference: cannot risk discovery proceedings. [Part 16, pg 5-10]\n\nIMPEACHMENT: Impeached for perjury/obstruction related to Lewinsky — documented pattern of deception regarding sexual conduct. [Part 16, pg 2-3]" },

  { id:"bp", l:"Brian Podesta", cl:"POD", x:610, y:220, sz:14, ev:"MODERATE", p:[17],
    tg:["ncmec","clearance","access","wapo-parents"],
    d:"Senior Analyst at NCMEC. Holds TS/SCI security clearance.",
    dt:"NCMEC ROLE: Direct access to the national database of missing and exploited children. TS/SCI clearance — highest level. [Part 17, pg 8-12]\n\nFAMILY: Parents are long-time Washington Post editors. HoneyBee investigation chain: Podesta → WaPo → NCMEC → Lockheed Martin → Podesta Group. [Part 17, pg 12-18]\n\nCENSORSHIP: Twitter censored tweets mentioning Brian Podesta/NCMEC in connection with John Podesta. [Part 17, pg 18-20]" },

  { id:"ec", l:"Elizabeth Cooley", cl:"POD", x:500, y:240, sz:11, ev:"HIGH", p:[1],
    tg:["mccann","emails","timing","cap"],
    d:"Executive Assistant to John Podesta at CAP.",
    dt:"MAY 4, 2007 EMAIL: Sent email on Podesta's behalf one day after Madeleine McCann disappeared. No journalist has ever asked Cooley about Podesta's location during the email gap (Nov 2006 - May 2007). [Part 1, pg 10-12]" },

  { id:"obama", l:"Barack Obama", cl:"POD", x:140, y:420, sz:20, ev:"HIGH", p:[3],
    tg:["acorn","denial","fight-the-smears"],
    d:"44th President. Documented ACORN relationship publicly denied.",
    dt:"ACORN TIES: Obama's 'Fight the Smears' website denied all ACORN ties. Contradicted by ACORN founder Rathke's published paper describing Obama as close collaborator. [Part 3, pg 2-8]\n\nCOVER-UP: Rathke paper removed from web but preserved on WikiLeaks. 'Fight the Smears' website taken down but archived. [Part 3, pg 6-8]" },

  { id:"grey", l:"William Grey", cl:"POD", x:120, y:150, sz:12, ev:"HIGH", p:[28],
    tg:["blackmail","lawsuit","brock","850k"],
    d:"David Brock's former domestic partner. Filed lawsuit with significant financial allegations.",
    dt:"LAWSUIT: Court documents reference $850,000 payment strongly suggesting blackmail. Court documents heavily redacted. If Brock is subject to blackmail, this creates structural explanation for Media Matters' aggressive PizzaGate attacks. [Part 28, pg 25-40]" },

  { id:"reines", l:"Philippe Reines", cl:"POD", x:400, y:370, sz:12, ev:"CONFIRMED", p:[13],
    tg:["clinton-aide","comets","pizza","direct-reference"],
    d:"Senior Clinton aide. Made direct mocking reference connecting pizza and Comet in tweet.",
    dt:"TWEET: Tweeted at Flynn Jr: 'What goes around COMETS around. And given your pizza obsession... xo Philippe' — making a direct, mocking reference linking pizza and Comet in the same message, from a senior Clinton aide. This tweet acknowledges awareness of the PizzaGate narrative while mocking those investigating it. [Part 13, pg 30-31]" },

  { id:"silsby", l:"Laura Silsby", cl:"POD", x:280, y:440, sz:14, ev:"CONFIRMED", p:[22],
    tg:["haiti","trafficking","amber-alert","name-change","33-children"],
    d:"Caught attempting to transport 33 Haitian children across border. Later worked for Amber Alert system under new name.",
    dt:"HAITI ARREST: Caught attempting to transport 33 Haitian children across the border into the Dominican Republic without proper documentation after the 2010 earthquake. [Part 22, pg 12-18]\n\nCHARGES REDUCED: Charges were reduced after intervention. The reduction of charges in a case involving 33 children is itself extraordinary. [Part 22, pg 18-20]\n\nNAME CHANGE: Changed her name to Laura Gayler and went to work for AlertSense — a company that manages Amber Alert systems for missing children. A woman caught transporting children illegally now works for a missing-children alert system. [Part 22, pg 20-22]\n\nCLINTON CONNECTION: Clinton Foundation was operating extensively in Haiti during the same period. Email correspondence regarding Silsby's case appears in the WikiLeaks archive. [Part 22, pg 22-25]" },

  // ═══ McCANN ═══
  { id:"km", l:"Kate McCann", cl:"MCC", x:750, y:370, sz:24, ev:"HIGH", p:[5,9,10,25,30],
    tg:["book","anomalous","arguido","freud","cadaver"],
    d:"Mother of Madeleine McCann. Medical doctor (GP). Author of 'Madeleine' (2011). Named arguido.",
    dt:"BOOK ANOMALIES: Kate's 2011 book contains passages highly unusual for a mother of a missing child. Wrote about imagining Madeleine's 'perfect little genitals torn apart.' Statement analysis expert Peter Hyatt flagged as indicative of knowledge of abuse. [Part 5, pg 10-12; Part 10, pg 5-15]\n\nCLEMENT FREUD: When named arguido (Sept 2007), the FIRST person Kate and Gerry visited was Clement Freud — confirmed pedophile. Freud joked about Kate being a 'nymphomaniac' and ridiculed cadaver dog evidence. [Part 9, pg 8-14]\n\nCADAVER DOGS: Specialist dogs gave positive alerts for cadaver scent AND blood in apartment 5A AND in the McCann rental car hired 25 DAYS after disappearance. [Part 9, pg 15-20; Part 10, pg 18-22]\n\nPAEDOPHILE OBSESSION: Book contains at least 12 separate passages discussing paedophiles in explicit detail. [Part 10, pg 8-16]\n\nARGUIDO: Portuguese police proposed she had a 'blackout' or 'loss of memory episode.' [Part 25, pg 15-22; Part 30, pg 10-18]" },

  { id:"gm", l:"Gerry McCann", cl:"MCC", x:860, y:320, sz:22, ev:"HIGH", p:[5,9,10],
    tg:["gaspar","arguido","dundee","cardiologist"],
    d:"Father of Madeleine McCann. Consultant cardiologist. Named arguido.",
    dt:"GASPAR STATEMENT: Dr. Katherina Gaspar's statement describes David Payne making sexual gestures while discussing Madeleine, with Gerry present. Gaspar states she 'looked at Gerry to see his reaction' — implying he neither objected nor appeared surprised. [Part 5, pg 5-10]\n\nSMITH SIGHTING: Witness Martin Smith later stated the man he saw carrying a child toward the beach looked like Gerry McCann. [Part 5, pg 14-16; Part 9, pg 18-20; Part 10, pg 20-22]" },

  { id:"dp", l:"David Payne", cl:"MCC", x:890, y:420, sz:24, ev:"HIGH", p:[5,6],
    tg:["gaspar","martin","organizer","suspect","clothing","bath"],
    d:"McCann family friend. Medical doctor. Organized both Majorca 2005 and Portugal 2007 holidays.",
    dt:"TWO INDEPENDENT ALLEGATIONS:\n\n1. GASPAR STATEMENTS (May 16, 2007): Dr. Katherina Gaspar witnessed Payne making explicitly sexual gestures referring to Madeleine — on at least TWO occasions. Katherina stopped trusting Payne to bathe children. When Madeleine disappeared: 'my thoughts went immediately to Dave.' [Part 5, pg 3-12]\n\n2. YVONNE MARTIN STATEMENT (June 13, 2007): 25-year child protection veteran found Payne 'familiar' from professional work. Formally identified him. Wrote anonymous letter requesting police check paedophile register. Clothing matched police description. [Part 6, pg 3-12]\n\nSUPPRESSION: UK police received Gaspar statements 13 days after disappearance but did NOT forward to Portuguese investigators for 6+ months — only AFTER Amaral was removed. [Part 5, pg 15-18]\n\nHOLIDAY ORGANIZER: Organized both holidays. Amaral noted this pattern. [Part 5, pg 18-20; Part 6, pg 12-14]" },

  { id:"mm", l:"Madeleine McCann", cl:"MCC", x:770, y:460, sz:20, ev:"CONFIRMED", p:[1,4,5,6,7,8,9,10,25,30],
    tg:["disappeared","cadaver-dogs","praia-da-luz","3-years-old","efits"],
    d:"Disappeared May 3, 2007 from apartment 5A, Ocean Club resort, Praia da Luz. Age 3.",
    dt:"DISAPPEARANCE: Reported missing ~22:00 May 3, 2007. Parents claim abduction while they dined ~50m away. [Part 1, pg 2-4]\n\nCADAVER EVIDENCE: Specialist dogs gave positive alerts in apartment 5A AND McCann rental car hired 25 days AFTER disappearance. [Part 9, pg 15-20; Part 10, pg 18-22]\n\nE-FITS: Scotland Yard released two e-fits Oct 2013 — 6+ YEARS after disappearance. Produced by McCann-hired ex-MI5 agents from witnesses who could NOT identify the face. Bear resemblance to John and Tony Podesta. [Part 1, pg 7-10; Part 4, pg 3-10; Part 30, pg 20-30]\n\nTIMELINE: E-fits produced 2008 → Portuguese police by Oct 2009 → Scotland Yard Aug 2011 → public Oct 2013. A 5-year suppression. [Part 30, pg 25-35]\n\nSEDATION THEORY: Kate's book raises question of whether Madeleine's 'excessive tiredness' was caused by a tranquilizer. [Part 10, pg 22-24]" },

  { id:"cm", l:"Clarence Mitchell", cl:"MCC", x:680, y:270, sz:18, ev:"CONFIRMED", p:[8,9,30],
    tg:["freud","bridge","media","spokesperson","government"],
    d:"McCann family spokesperson. CRITICAL BRIDGE NODE.",
    dt:"THE BRIDGE: Connects: (1) McCann family (spokesperson) → (2) Matthew Freud (employer) → (3) Sir Clement Freud (confirmed pedophile with villa at Praia da Luz). Parents of missing child hired spokesperson employed by son of pedophile who had property at the disappearance location. [Part 8, pg 10-14; Part 9, pg 5-8; Part 30, pg 15-20]\n\nGOVERNMENT: Before McCanns, Mitchell worked for UK government's Central Office of Information. [Part 8, pg 14-16]\n\nNEVER ASKED: No journalist has asked Mitchell about the conflict of interest. [Part 30, pg 18-20]" },

  { id:"sf", l:"Smith Family", cl:"MCC", x:800, y:520, sz:14, ev:"HIGH", p:[4,30],
    tg:["witnesses","efits","unreliable","ireland"],
    d:"Irish family on holiday. Key witnesses: Martin Smith, Peter Smith, Aoife Smith (12).",
    dt:"SIGHTING: Night of May 3, 2007, saw man carrying child toward beach ~21:55-22:00. None could clearly see the man's face. [Part 4, pg 5-8]\n\nAGE ESTIMATES: Adult witnesses consistently estimated 35-40. Snopes/NYT used the 12-year-old's lower estimate of 20-30 to make Podestas seem too old. [Part 4, pg 8-10; Part 30, pg 28-32]\n\nCRITICAL: All explicitly stated they COULD NOT identify in a photograph. Yet e-fits were produced. [Part 4, pg 10-12; Part 30, pg 30-35]\n\nCCTV: Footage from hotel Estrela da Luz wiped before police obtained it. [Part 30, pg 35-38]" },

  { id:"fp", l:"Fiona Payne", cl:"MCC", x:930, y:460, sz:12, ev:"MODERATE", p:[5],
    tg:["majorca","portugal","payne","wife"],
    d:"David Payne's wife. Doctor. Present during both holidays.",
    dt:"Present during Majorca holiday where Gaspar witnessed David Payne's gestures. Present during Portugal trip. Has never publicly addressed Gaspar statements about her husband. [Part 5, pg 12-14]" },

  // ═══ CONFIRMED PEDOPHILES ═══
  { id:"cf", l:"Sir Clement Freud", cl:"PED", x:680, y:160, sz:26, ev:"CONFIRMED", p:[8,9],
    tg:["confirmed","villa","mccann","dundee","bbc","knight","sigmund"],
    d:"Liberal MP (1973-87). BBC broadcaster. Grandson of Sigmund Freud. CONFIRMED pedophile.",
    dt:"CONFIRMED PEDOPHILE: June 2016 ITV documentary exposed 3 victims. Sylvia Woosley: abused from age 10-11. Anonymous woman: groomed from 11, raped at 18. Vicky Hayes: assaulted/raped as teenager. [Part 8, pg 3-10]\n\nMcCANN CONNECTION: Villa in Praia da Luz. Contacted McCanns July 2007. Kate describes him glowingly. When McCanns named suspects, Freud was FIRST person they visited. [Part 8, pg 10-14; Part 9, pg 8-14]\n\nDUNDEE: Rector where Craig Murray confirmed Freud 'preyed on female students.' Kate McCann attended same university. [Part 8, pg 14-16]\n\nPOSTHUMOUS: Died 2009. Exposed 2016 — 7 years later. Pattern: pedophiles in power exposed only after death. [Part 8, pg 16]" },

  { id:"mf", l:"Matthew Freud", cl:"MED", x:600, y:110, sz:15, ev:"CONFIRMED", p:[8,9],
    tg:["pr","mitchell","bridge","son","cancelled-party"],
    d:"PR executive. Son of confirmed pedophile Clement Freud. Employed Clarence Mitchell.",
    dt:"BRIDGE NODE: Employed Mitchell → McCanns' spokesperson. Direct link between McCann family and confirmed pedophile's family. Cancelled annual party after father's exposure. [Part 8, pg 12-14; Part 9, pg 5-8]" },

  { id:"epstein", l:"Jeffrey Epstein", cl:"PED", x:100, y:400, sz:26, ev:"CONFIRMED", p:[17,22],
    tg:["convicted","clinton","island","intelligence","cernovich","lolita"],
    d:"Billionaire financier. Convicted sex offender. Connected to global elite.",
    dt:"CONVICTIONS: Pleaded guilty 2008 to procuring a child for prostitution. Lenient 13-month sentence negotiated by future Trump Labor Secretary Acosta. [Part 17, pg 15-18; Part 22, pg 30-35]\n\nBILL CLINTON: Flight logs document 26+ flights on 'Lolita Express.' Some to private island. [Part 17, pg 18-20]\n\nINTELLIGENCE TIES: Operation mirrors classic intelligence blackmail described by Ken Livingstone. [Part 17, pg 20-22; Part 22, pg 35-38]\n\nDEATH: Found dead Aug 10, 2019. Guards asleep, cameras malfunctioned. [Part 22, pg 38-42]" },

  { id:"heath", l:"Sir Edward Heath", cl:"PED", x:920, y:140, sz:22, ev:"HIGH", p:[14],
    tg:["pm","satanic","posthumous","icke","wiltshire","120-percent"],
    d:"Former UK PM (1970-74). Operation Conifer investigation.",
    dt:"INVESTIGATION: Wiltshire Police Chief Constable Mike Veale stated allegations '120 per cent genuine.' 30+ victims with 'strikingly similar' accounts. [Part 14, pg 15-20]\n\nSATANIC RITUAL: Women alleged satanic sex cult connected to Heath. 'Regularly slaughtered children as ritual sacrifices.' [Part 14, pg 20-25]\n\nDAVID ICKE: Named Heath as pedophile since 1998 — nearly 20 years before police confirmed. [Part 14, pg 25-28]\n\nPATTERN: Former PM, decades of abuse, known to intelligence, protected alive, exposed posthumously. Identical to Freud, Savile. [Part 14, pg 26-28]" },

  { id:"hastert", l:"Dennis Hastert", cl:"PED", x:80, y:490, sz:20, ev:"CONFIRMED", p:[18,29],
    tg:["convicted","speaker","blackmail-question","wrestling","nsa"],
    d:"Former Speaker of US House (1999-2007). Third in line of succession. Convicted serial child molester.",
    dt:"CONVICTION: Judge called him 'serial child molester.' Abused boys as wrestling coach for decades. [Part 18, pg 20-24; Part 29, pg 35-40]\n\nTHE CENTRAL QUESTION: How did NSA/CIA/FBI not know? Three possibilities: (1) Didn't know = catastrophic failure. (2) Knew and didn't act = criminal complicity. (3) Knew and USED it = confirms Livingstone's blackmail system. [Part 18, pg 24-28]\n\nSENTENCE: 15 months — extraordinarily lenient for serial child molester. [Part 29, pg 40-42]" },

  { id:"sandusky", l:"Jerry Sandusky", cl:"PED", x:40, y:350, sz:18, ev:"CONFIRMED", p:[12],
    tg:["convicted","institutional","penn-state","son"],
    d:"Former Penn State assistant football coach. Convicted of 45 counts.",
    dt:"INSTITUTIONAL COVER-UP: Penn State leadership charged. Freeh Report found 'total and consistent disregard' for children's safety. [Part 12, pg 14-16]\n\nSON ARRESTED: Jeffrey Sandusky arrested Feb 13, 2017 on child sex abuse charges — predicted by David Seaman's source. [Part 12, pg 16-18]\n\nSECOND MILE: Founded charity for at-risk youth — exact model where pedophiles create charities to gain access. [Part 12, pg 18]" },

  { id:"ke", l:"Kurt Eichenwald", cl:"MED", x:160, y:100, sz:20, ev:"HIGH", p:[13,14,15,17,26],
    tg:["court-docs","child-porn","nyt","no-prosecution","tentacle","alias","paypal"],
    d:"Former NYT reporter. Newsweek writer. MSNBC contributor. Documented child porn access.",
    dt:"COURT EVIDENCE: IP traced to Dallas (Eichenwald's location) accessed child porn video 22+ times. $2,000 check funded child porn production — $300 used to pay 14-year-old minor. PayPal payments under alias 'Andrew McDonald.' Admin access ('Roy Rogers') on JustinsFriends.com. [Part 15, pg 3-15; Part 17, pg 3-8]\n\nNO PROSECUTION: Despite federal court documentation, never charged. Defense: 'severe memory disruptions from epilepsy.' [Part 15, pg 15-18]\n\nNYT CONTRADICTION: Same NYT published Eichenwald's 2006 pedophile investigation documenting FBI symbols, then in 2016 dismissed those same symbols near Comet Ping Pong as 'common shapes.' [Part 13, pg 15-27; Part 14, pg 3-10]\n\nTENTACLE PORN: June 2017 Twitter screenshot showing browser tab with tentacle porn. Claimed was 'looking it up with my kid.' [Part 26, pg 35-40]" },

  { id:"savile", l:"Jimmy Savile", cl:"PED", x:960, y:180, sz:18, ev:"CONFIRMED", p:[14,30],
    tg:["bbc","posthumous","hundreds","uk","national-treasure"],
    d:"BBC presenter. 450+ alleged victims over six decades. Exposed after death.",
    dt:"SCALE: After death in 2011, emerged he abused hundreds over six decades. Operation Yewtree: 450+ victims. [Part 14, pg 10-14]\n\nBBC COVER-UP: BBC suppressed Newsnight investigation. Multiple staff aware. [Part 14, pg 14-15; Part 30, pg 45-48]\n\nKEY LESSON: If Britain's most beloved TV presenter could abuse hundreds for 60 years with institutional protection, similar networks at political levels is consistent with documented precedent. [Part 14, pg 15]" },

  // ═══ INTELLIGENCE ═══
  { id:"cia", l:"CIA", cl:"INT", x:90, y:260, sz:28, ev:"CONFIRMED", p:[18],
    tg:["vault7","surveillance","blackmail","cyber-weapons","fake-attribution"],
    d:"Central Intelligence Agency. Universal surveillance capability confirmed by Vault 7.",
    dt:"VAULT 7 YEAR ZERO (March 7, 2017): 8,761 documents revealing: universal device hacking, Samsung 'Weeping Angel' (TV records while appearing off), UMBRAGE attribution masking (can blame Russia/China for its own attacks), vehicle hacking, autonomous NSA-like capability. [Part 18, pg 3-18]\n\nBLACKMAIL IMPLICATION: With universal device access, CIA can monitor anyone's communications, browsing, camera — creating unlimited blackmail material. Combined with Livingstone's MI5 admission, confirms TECHNICAL CAPABILITY for systematic blackmail. [Part 18, pg 18-25]\n\nFAKE ATTRIBUTION: UMBRAGE means ANY attributed cyberattack could actually be CIA. Russia hack attribution therefore unreliable. [Part 18, pg 12-15]" },

  { id:"mi5", l:"MI5", cl:"INT", x:940, y:240, sz:26, ev:"CONFIRMED", p:[18,30],
    tg:["blackmail","efits","kincora","livingstone","uk-domestic"],
    d:"UK Security Service. Documented pedophilia blackmail operations.",
    dt:"KEN LIVINGSTONE AUDIO: Former Mayor of London confirming MI5 filmed child abuse at Kincora Boys Home specifically for political blackmail. 'Going on for decades and decades.' NEVER formally investigated. [Part 18, pg 25-30]\n\nMcCANN E-FITS: Private firm hired by McCanns staffed by former MI5 agents. Produced e-fits from witnesses who couldn't identify the face. Suppressed 5 years. [Part 30, pg 20-30]\n\nKINCORA: Systematic child abuse. MI5's role in covering up (and facilitating for blackmail) documented by multiple investigations. [Part 18, pg 28-30]" },

  { id:"sy", l:"Scotland Yard", cl:"INT", x:840, y:220, sz:20, ev:"CONFIRMED", p:[1,4,30],
    tg:["operation-grange","efits","delay","12-million"],
    d:"Metropolitan Police. Operation Grange. £12M+ spent on McCann case.",
    dt:"E-FIT TIMELINE: Received Aug 2011. Released Oct 2013 — 2+ year delay, 6+ years after disappearance. No explanation. [Part 1, pg 12-14; Part 4, pg 14-16; Part 30, pg 30-35]\n\nOPERATION GRANGE: £12M+. 41 persons of interest. Case unsolved. Key witnesses never prominently featured. [Part 30, pg 35-40]\n\nDec 2016: Announced 'important new lead' about traffickers — NYT, CNN, Guardian did NOT report. [Part 30, pg 40-42]" },

  { id:"sessions", l:"Jeff Sessions", cl:"INT", x:260, y:470, sz:16, ev:"CONFIRMED", p:[11],
    tg:["ag","pizza-day","executive-order","trafficking","120-days"],
    d:"81st Attorney General. Signed in on National Pizza Day.",
    dt:"NATIONAL PIZZA DAY: Sworn in Feb 9, 2017 — National Pizza Day. Same day, Trump signed anti-trafficking Executive Order. [Part 11, pg 3-6]\n\nEXECUTIVE ORDER: 120-day report on transnational criminal organizations including 'illegal smuggling and trafficking of humans.' [Part 11, pg 6-10]\n\nDHS BLUE CAMPAIGN: Anti-trafficking ad featured pizza establishment in opening clip. [Part 11, pg 10-12]" },

  { id:"flynn", l:"Gen. Flynn / Flynn Jr.", cl:"INT", x:360, y:450, sz:18, ev:"MODERATE", p:[13,30],
    tg:["list","fired","targeted","nsa-director","dia"],
    d:"Lt. Gen. Flynn: Former DIA Director. Flynn Jr. fired from transition team for PizzaGate tweets.",
    dt:"FLYNN JR. FIRED: Fired specifically for tweeting about PizzaGate. [Part 13, pg 28-30]\n\nROGER STONE CLAIM: Stone stated Flynn possesses a 'list of high-level pedophiles.' [Part 30, pg 42-45]\n\nTARGETED: Flynn Sr., Flynn Jr., and Milo Yiannopoulos — the three most targeted figures — all raised PizzaGate concerns. [Part 13, pg 30-32; Part 30, pg 45-48]\n\nINTELLIGENCE: Flynn Sr. was DIA Director — would have had access to classified intelligence about pedophile networks. [Part 30, pg 48-50]" },

  { id:"trump", l:"Donald Trump", cl:"INT", x:300, y:400, sz:22, ev:"CONFIRMED", p:[11,13,20],
    tg:["eo","sessions","trafficking","alex-jones","dhs"],
    d:"45th President. Anti-trafficking Executive Order. Complex Epstein history.",
    dt:"ANTI-TRAFFICKING: Executive Order Feb 9, 2017. Anti-trafficking meetings. DHS Blue Campaign. [Part 11, pg 3-10]\n\nALEX JONES: Gave interview to InfoWars Dec 2015. [Part 13, pg 5; Part 20, pg 22]\n\nTRUMP SPEECH (Dec 17, 2016): Stated politicians controlled by 'something else' and Sessions will 'catch them.' Many interpreted as pedophilia blackmail reference. [Part 11, pg 10-12; Part 13, pg 5-7]" },

  { id:"stone", l:"Roger Stone", cl:"INT", x:220, y:480, sz:14, ev:"HIGH", p:[30],
    tg:["named","list","twitter","trump-ally","dershowitz"],
    d:"Political consultant. Publicly named alleged pedophiles since 2015.",
    dt:"PUBLIC NAMING: Since 2015, accused Dershowitz, Podesta, Epstein, Bill Clinton of being pedophiles. None sued — paralleling Alex Jones/Clinton logic. [Part 30, pg 42-48]\n\nFLYNN LIST: Stated Flynn possesses 'list of high-level pedophiles.' [Part 30, pg 45-48]" },

  { id:"fbi", l:"FBI", cl:"INT", x:60, y:180, sz:20, ev:"CONFIRMED", p:[12,13],
    tg:["symbols","anon","eichenwald","comey","innocent-images"],
    d:"FBI. Published pedophile symbols document. Did not prosecute Eichenwald.",
    dt:"PEDOPHILE SYMBOLS: Published Jan 31, 2007. BoyLover, GirlLover, ChildLover logos. [Part 12, pg 3-10]\n\nEICHENWALD: Despite federal court documentation, did not prosecute. [Part 15, pg 15-18]\n\nFBI ANON: Anonymous poster's predictions validated including Brock heart attack. [Part 13, pg 7-10]\n\nCOMEY: FBI Director reportedly held by 'Ramsey rapist' at age 15. Questions about intelligence leaders having exploitable backgrounds. [Part 24, pg 2-3]" },

  // ═══ WHISTLEBLOWERS ═══
  { id:"amaral", l:"Gonçalo Amaral", cl:"WHI", x:830, y:500, sz:22, ev:"CONFIRMED", p:[4,5,9,10,30],
    tg:["removed","book","gaspar","libel","truth-of-lie","portimao"],
    d:"Former Polícia Judiciária coordinator. Led McCann investigation. Author of 'Truth of the Lie.'",
    dt:"INVESTIGATION: Led Portuguese investigation until Oct 2007. Concluded Madeleine likely died in apartment. [Part 4, pg 3-6; Part 5, pg 15-18]\n\nREMOVAL: Removed Oct 2007. CRITICALLY: Gaspar statements only forwarded AFTER his removal. [Part 4, pg 10-14; Part 5, pg 16-18]\n\nBOOK: 'Truth of the Lie' published July 2008. 180,000 copies. Banned/unbanned multiple times. [Part 4, pg 14-16; Part 5, pg 18-20]\n\nSUPREME COURT: Portuguese Supreme Court ruled in Amaral's FAVOR Jan 2017 — validated his right to state professional conclusions. [Part 10, pg 22-24; Part 30, pg 10-15]" },

  { id:"gaspar", l:"Gaspar Couple", cl:"WHI", x:910, y:490, sz:16, ev:"CONFIRMED", p:[5],
    tg:["statements","suppressed","payne","nhs","dundee","majorca"],
    d:"Dr. Katherina & Dr. Savio Gaspar. Both NHS doctors.",
    dt:"KATHERINA (May 16, 2007): Witnessed Payne making sexual gestures re: Madeleine on TWO occasions during Sept 2005 Majorca holiday. 'My thoughts went immediately to Dave' when Madeleine disappeared. [Part 5, pg 3-10]\n\nSUPPRESSION: Statements given 13 days after disappearance. UK police withheld from Portuguese for 6+ months — released only AFTER Amaral removed. [Part 5, pg 15-18]\n\nMEDIA SILENCE: Zero BBC, Guardian, Telegraph coverage. [Part 5, pg 18-20]" },

  { id:"yvonne", l:"Yvonne Martin", cl:"WHI", x:790, y:520, sz:16, ev:"CONFIRMED", p:[6],
    tg:["professional","identified","anonymous-letter","zero-coverage","25-years"],
    d:"Child protection social worker, 25+ years experience.",
    dt:"ARRIVAL (May 4, 2007): Identified herself with official credentials at McCann apartment. Kate stated daughter was 'taken by a couple.' Third man moved couple away — Martin later identified this man as David Payne. [Part 6, pg 3-8]\n\nPAYNE: Found him 'familiar' from child protection work. Formally identified from photographs June 13, 2007. Clothing matched police description of man carrying child. [Part 6, pg 8-12]\n\nANONYMOUS LETTER: Requested police check paedophile register for Payne. '99.99% of missing children cases, the parents or other family members are involved.' [Part 6, pg 12-14]\n\nMEDIA: Zero BBC/Guardian/Telegraph coverage. [Part 6, pg 14]" },

  { id:"hall", l:"Richard Hall", cl:"WHI", x:860, y:560, sz:16, ev:"CONFIRMED", p:[4,18,30],
    tg:["films","efits","mi5","maloney","richplanet","14-hours"],
    d:"Investigative filmmaker. richplanet.net. 14+ hrs McCann documentaries.",
    dt:"DOCUMENTARIES: Exposed e-fit fabrication, MI5 involvement, cadaver evidence. [Part 4, pg 14-18; Part 30, pg 20-25]\n\nBILL MALONEY: Described CIA/MI5 methodology: identify pedophilic individuals → secretly record → use as blackmail. [Part 18, pg 25-28]\n\nKEN LIVINGSTONE: Featured the audio recording about MI5 filming Kincora abuse — single most important evidence piece. [Part 18, pg 28-30]" },

  { id:"bernard", l:"Ronald Bernard", cl:"WHI", x:40, y:210, sz:14, ev:"UNVERIFIED", p:[23],
    tg:["sacrifice","luciferian","banking","unverified","emotional"],
    d:"Alleged former elite Dutch banker. Claims child sacrifice rituals.",
    dt:"TESTIMONY: Described being invited to child sacrifice ritual at highest levels of banking. Identified elites as Luciferians/Satanists. Extremely emotional interview. [Part 23, pg 15-22]\n\nASSESSMENT: Unverified, relies on personal testimony. Aligns with Heath satanic allegations (30+ victims), Rothschild Ball imagery, Icke's claims. [Part 23, pg 22-25]" },

  { id:"moran", l:"Bill Moran", cl:"WHI", x:160, y:60, sz:12, ev:"HIGH", p:[15,17],
    tg:["eichenwald","censored","dead","medium","court-docs"],
    d:"Journalist who exposed Eichenwald via court records. Reported dead.",
    dt:"ARTICLE: Published Eichenwald exposé on Medium (Dec 26, 2016) using federal court filings. Article subsequently removed. Twitter suspended. Reported dead. [Part 15, pg 18-20; Part 17, pg 8-10]" },

  { id:"leyland", l:"Brenda Leyland", cl:"WHI", x:720, y:540, sz:12, ev:"CONFIRMED", p:[25],
    tg:["dead","sky-news","ambush","tweets","helium","mccann-critic"],
    d:"Posted ~400 tweets critical of McCanns. Found dead days after Sky News ambush.",
    dt:"TWEETS: ~400 tweets under @sweepyface questioning McCann narrative. Critical but not threatening. [Part 25, pg 30-35]\n\nSKY NEWS AMBUSH: Reporter Martin Brunt confronted at home. Broadcast on Sky News. [Part 25, pg 35-38]\n\nDEATH: Found dead at Marriott hotel Oct 4, 2014. Helium inhalation. Ruled suicide. Days after ambush. No prior documented mental illness. [Part 25, pg 38-42]\n\nPATTERN: Combined with Tony Bennett's suspended prison sentence for publishing McCann allegations — documented chilling effect. [Part 25, pg 42-45]" },

  { id:"hyatt", l:"Peter Hyatt", cl:"WHI", x:770, y:580, sz:10, ev:"HIGH", p:[5],
    tg:["statement-analysis","mccann","language","law-enforcement"],
    d:"Statement analysis expert. Works with law enforcement.",
    dt:"ANALYSIS: Concluded linguistic markers in McCann statements are consistent with deception and prior knowledge of harm. Noted Madeleine likely abuse victim based purely on language patterns. [Part 5, pg 10-14]" },

  { id:"sawyer", l:"Craig Sawyer", cl:"WHI", x:60, y:310, sz:12, ev:"CONFIRMED", p:[21],
    tg:["navy-seal","crowdfunding-blocked","trafficking","vets4childrescue"],
    d:"Former Navy SEAL. Founded Veterans for Child Rescue.",
    dt:"V4CR: Anti-trafficking organization. GoFundMe cancelled before completion. YouCaring cancelled without reason. Multiple platforms refused. Had to use gunfund.me. [Part 21, pg 50-60]\n\nSYSTEMATIC BLOCKING: Platform-level suppression of decorated military veteran's anti-trafficking charity. Anti-trafficking is not controversial — unless it involves protected individuals. [Part 21, pg 60-65]" },

  { id:"cernovich", l:"Mike Cernovich", cl:"WHI", x:160, y:460, sz:14, ev:"HIGH", p:[17,22],
    tg:["epstein","censorship","google","clearances","insider"],
    d:"Investigative journalist. Targeted by Epstein legal team.",
    dt:"EPSTEIN: Secret, fully redacted legal papers filed against him. Cernovich cannot even know what he's accused of. [Part 17, pg 20-22; Part 22, pg 35-38]\n\nINSIDER SOURCES: Claims Deep State ensures clearance approvers are themselves compromised — self-reinforcing system. [Part 17, pg 22-24]\n\nCLARIFICATION: Researcher notes Cernovich's Epstein claim may be 'unclear and/or purposely misleading' — demonstrating commitment to critical analysis. [Part 22, pg 38-40]" },

  { id:"seaman", l:"David Seaman", cl:"WHI", x:220, y:50, sz:14, ev:"MODERATE", p:[12,19,20,26],
    tg:["journalist","censored","huffpo","goldmoney","prediction"],
    d:"Former HuffPost contributor. Became prominent PizzaGate researcher. YouTube channel censored.",
    dt:"HUFFPOST: Former contributor. HuffPost removed all his articles after he covered PizzaGate. [Part 12, pg 3-5; Part 26, pg 25-28]\n\nPREDICTION: Based on source, predicted a 'high level, high profile arrest' — Jeffrey Sandusky (Jerry Sandusky's son) was arrested on child sex abuse charges Feb 13, 2017. [Part 12, pg 16-18]\n\nDC PROTEST: Spoke at Lafayette Park PizzaGate protest March 25, 2017. YouTube censored live streams. [Part 19, pg 2-8; Part 20, pg 30-35]\n\nBUZZFEED ATTACK: Joseph Bernstein (BuzzFeed) used Media Matters framing to target Seaman specifically. [Part 26, pg 28-32]" },

  { id:"frost", l:"Titus Frost", cl:"WHI", x:310, y:50, sz:12, ev:"MODERATE", p:[20,32],
    tg:["journalist","protest","server","reddit","youtube"],
    d:"PizzaGate researcher. Spoke at DC protest. Investigated alleged Comet Ping Pong server.",
    dt:"DC PROTEST: Spoke at Lafayette Park protest March 25, 2017. [Part 20, pg 30-35]\n\nALLEGED SERVER: Interviewed alleged hacker who claimed to find 'Cheese Pizza' on Comet Ping Pong server. UNVERIFIED claim. [Part 32, pg 30-35]\n\nYOUTUBE: Channel targeted for censorship alongside other PizzaGate researchers. [Part 20, pg 35-38]" },

  { id:"jones", l:"Alex Jones", cl:"WHI", x:130, y:380, sz:18, ev:"CONFIRMED", p:[16,19,20],
    tg:["infowars","grove","apology","clinton","alternative-media"],
    d:"InfoWars host. Infiltrated Bohemian Grove. Forced to apologize re: Alefantis.",
    dt:"BILL CLINTON LOGIC: Called Clinton rapist for years, sold t-shirts, ran $100K contest. Clinton NEVER sued. If claims false, Clinton has clear legal standing. Logical inference: cannot risk discovery proceedings. [Part 16, pg 3-10]\n\nALEFANTIS APOLOGY: Issued unprecedented public apology and retraction regarding Alefantis/Comet Ping Pong. Demonstrates significant legal/political power of a 'pizza shop owner' when Clinton won't even sue for 'rapist' claims. [Part 20, pg 22-28]\n\nBOHEMIAN GROVE: Infiltrated in 2000, filmed Cremation of Care ceremony. [Part 19, pg 30-35]\n\nTRUMP INTERVIEW: Dec 2015 InfoWars interview. [Part 20, pg 22]" },

  { id:"obrien", l:"Cathy O'Brien", cl:"WHI", x:350, y:530, sz:12, ev:"UNVERIFIED", p:[22,25],
    tg:["mk-ultra","trance-formation","haiti","trudeau","unverified"],
    d:"Self-described MK Ultra victim. Author of 'Trance Formation of America' (1995).",
    dt:"BOOK (1995): Wrote 'Haiti was a prototype of New World Order controls' — 15 years before Clinton Foundation earthquake operations. [Part 22, pg 25-28]\n\nPIERRE TRUDEAU: Accused Pierre Trudeau (father of Canadian PM) of pedophilia. David Icke made similar claims. [Part 20, pg 38-40; Part 25, pg 50-55]\n\nASSESSMENT: Claims are unverified. However, some specific predictions (Haiti, institutional patterns) proved consistent with later documented events. [Part 22, pg 28-30]" },

  { id:"bennett", l:"Tony Bennett", cl:"WHI", x:740, y:600, sz:10, ev:"CONFIRMED", p:[25],
    tg:["mccann","prison","publications","chilling-effect"],
    d:"UK researcher. Received suspended prison sentence for publishing McCann allegations.",
    dt:"SENTENCING: Received suspended prison sentence for publishing material alleging McCann involvement in Madeleine's disappearance. Combined with Brenda Leyland's death, creates documented chilling effect on public McCann investigation. [Part 25, pg 42-48]" },

  // ═══ ORGANIZATIONS ═══
  { id:"acorn", l:"ACORN", cl:"ORG", x:120, y:540, sz:18, ev:"CONFIRMED", p:[2,3],
    tg:["veritas","trafficking","defunded","obama","embezzlement"],
    d:"Association of Community Organizations for Reform Now. Defunded after trafficking exposure.",
    dt:"PROJECT VERITAS (2009): In 6 of 7 cities, employees willingly assisted hypothetical child sex trafficking ring. Only LA office refused. [Part 2, pg 3-8]\n\nLEGAL: California AG confirmed employees discussed criminal plan. No prosecution since children weren't real — but WILLINGNESS demonstrated. [Part 2, pg 8-10]\n\nEMBEZZLEMENT: Founder's brother embezzled ~$1M (possibly $5M). Covered up for 8 years. [Part 2, pg 10-11]\n\nSIGNIFICANCE: Proof-of-concept that federally funded organizations were willing to facilitate child trafficking. [Part 2, pg 11; Part 3, pg 6-8]" },

  { id:"ncmec", l:"NCMEC", cl:"ORG", x:590, y:340, sz:20, ev:"MODERATE", p:[17],
    tg:["brian-podesta","access","clearance","database","honeybee"],
    d:"National Center for Missing & Exploited Children.",
    dt:"BRIAN PODESTA: Senior Analyst with TS/SCI clearance and direct database access. [Part 17, pg 8-12]\n\nHONEYBEE: Mapped connections: Podesta → WaPo → NCMEC → Lockheed Martin → Podesta Group. Twitter censored related tweets. [Part 17, pg 12-18]" },

  { id:"comet", l:"Comet Ping Pong", cl:"ORG", x:260, y:130, sz:18, ev:"MODERATE", p:[12,20,32],
    tg:["symbols","alefantis","shooting","server","cpp","besta"],
    d:"Restaurant in Washington DC. Central location in public PizzaGate narrative.",
    dt:"SYMBOLISM: Logo similar to FBI pedophile symbols. Nearby Besta Pizza logo resembled BoyLover symbol — changed after scrutiny. [Part 12, pg 8-12; Part 20, pg 15-18]\n\nSHOOTING (Dec 4, 2016): Edgar Welch fired one round (hit a computer hard drive). Used by MSM to discredit all research. [Part 12, pg 12-14; Part 20, pg 18-20]\n\nRESEARCHER'S POSITION: 'PizzaGate is MUCH bigger than Comet Ping Pong.' Broader patterns of institutional pedophilia, media cover-up, and intelligence blackmail are far more significant. [Part 20, pg 38-40; Part 32, pg 80-85]" },

  { id:"mm_org", l:"Media Matters", cl:"ORG", x:120, y:170, sz:14, ev:"CONFIRMED", p:[26,28],
    tg:["brock","censorship","clinton","buzzfeed","attack"],
    d:"Media watchdog founded by David Brock. Clinton-aligned attack apparatus.",
    dt:"FUNCTION: Coordinates with MSM to attack alternative narratives. Targeted PizzaGate researchers specifically. [Part 26, pg 15-20; Part 28, pg 5-10]\n\nBROCK-ALEFANTIS: Founded by Brock, ex-boyfriend of Alefantis. Primary attack org run by ex-partner of Comet Ping Pong owner. [Part 26, pg 10-12]\n\n$850K: Brock's Grey lawsuit suggests blackmail — attacking PizzaGate to protect himself. [Part 28, pg 25-40]" },

  { id:"cf_org", l:"Clinton Foundation", cl:"ORG", x:250, y:390, sz:22, ev:"HIGH", p:[22,25],
    tg:["haiti","trafficking","silsby","flows","un"],
    d:"Private foundation. Haiti operations concurrent with UN trafficking.",
    dt:"HAITI: Primary organization in Haiti post-2010 earthquake. UN peacekeepers simultaneously documented trafficking. [Part 22, pg 10-15]\n\nLAURA SILSBY: Caught with 33 children. Charges reduced. Now works for Amber Alert system under new name. [Part 22, pg 15-25]\n\nUN TRAFFICKING: Multiple documented cases in same region. [Part 22, pg 25-30]" },

  { id:"wl", l:"WikiLeaks", cl:"ORG", x:460, y:100, sz:18, ev:"CONFIRMED", p:[1,12,18,29],
    tg:["emails","vault7","controlled-opposition","assange","10-year-record"],
    d:"Leak platform. Released Podesta emails and Vault 7.",
    dt:"PODESTA EMAILS: 50,000+ emails Oct-Nov 2016. Anomalous food-coded language, Spirit Cooking, Luzzatto pool email. [Part 1, pg 3-6; Part 12, pg 3-5]\n\nVAULT 7: CIA cyber-weapons documents March 7, 2017. [Part 18, pg 3-18]\n\n10-YEAR RECORD: Undisputed accuracy. No one has disputed authenticity. [Part 29, pg 50-55]\n\nCONTROLLED OPPOSITION: Researcher assesses WikiLeaks as 'likely controlled opposition' — mainstream media of leaks, releasing what intelligence wants released. [Part 29, pg 55-70]" },

  { id:"un", l:"United Nations", cl:"ORG", x:300, y:500, sz:16, ev:"HIGH", p:[22],
    tg:["haiti","peacekeepers","trafficking","documented"],
    d:"UN peacekeepers documented trafficking in Haiti.",
    dt:"Multiple documented cases of UN peacekeeper sexual exploitation/trafficking in Haiti. Same region as Clinton Foundation. Minimal MSM coverage. [Part 22, pg 25-30]" },

  { id:"trudeau_f", l:"Trudeau Foundation", cl:"ORG", x:40, y:130, sz:12, ev:"LOW", p:[20],
    tg:["logo","boylover","canada","pierre-trudeau"],
    d:"Pierre Elliott Trudeau Foundation. Logo resembles FBI BoyLover symbol.",
    dt:"LOGO: Resembles FBI-documented BoyLover symbol. Works with vulnerable children. Pierre Trudeau accused by Cathy O'Brien and Icke. Evidence level LOW — logo alone not conclusive. [Part 20, pg 38-40]" },

  { id:"voat", l:"Voat / Reddit", cl:"ORG", x:380, y:60, sz:14, ev:"CONFIRMED", p:[19,32],
    tg:["banned","migration","censorship","r-conspiracy","platform"],
    d:"Reddit banned r/pizzagate. Community migrated to voat.co/v/pizzagate. Researcher banned from r/conspiracy.",
    dt:"REDDIT BAN: r/pizzagate banned Nov 2016. Community migrated to voat.co/v/pizzagate. [Part 19, pg 8-12]\n\nR/CONSPIRACY BAN: Researcher banned from r/Conspiracy for 'spam' after posting Luzzatto research. Eventually unbanned through intermediary. [Part 32, pg 70-80]\n\nPATTERN: Even ostensibly conspiracy-friendly platforms suppress PizzaGate research. Demonstrates censorship extends beyond mainstream platforms. [Part 32, pg 75-85]" },

  // ═══ OCCULT ═══
  { id:"abramovic", l:"Marina Abramovic", cl:"OCC", x:360, y:50, sz:18, ev:"HIGH", p:[27],
    tg:["spirit-cooking","podesta","rothschild","blood","gaga"],
    d:"Performance artist. 'Spirit Cooking' practitioner. Connected to Podesta and Rothschild circles.",
    dt:"SPIRIT COOKING EMAIL: WikiLeaks shows Abramovic inviting Tony Podesta. John forwarded. Involves blood, semen, breast milk rituals. [Part 27, pg 4-12]\n\nSEARCH TRENDS: 'Spirit Cooking' spike preceded and triggered PizzaGate spike — initial catalyst. [Part 27, pg 12-16]\n\nROTHSCHILD: Connected to Rothschild social circles. [Part 27, pg 16-20]\n\nCELEBRITY: Connected to Lady Gaga, Jay-Z. Art involves harm, ritual, boundary-transgression. [Part 27, pg 20-25]" },

  { id:"rothschild", l:"Rothschild Family", cl:"OCC", x:460, y:30, sz:18, ev:"HIGH", p:[27],
    tg:["ball","occult","macron","lynn","banking-dynasty"],
    d:"Banking dynasty. 1972 Surrealist Ball. Lynn de Rothschild attacked Podesta.",
    dt:"1972 BALL: Occult-themed costumes, dismembered dolls, Dalí, Audrey Hepburn, stag's head with diamond tears. [Part 27, pg 25-32]\n\nLYNN DE ROTHSCHILD: Publicly attacked Podesta post-election — unusual distancing. [Part 27, pg 32-35]\n\nMACRON: Rothschild Investment Banker before politics. Began relationship with 40-year-old teacher at age 15. [Part 27, pg 35-37]" },

  { id:"bg", l:"Bohemian Grove", cl:"OCC", x:520, y:50, sz:12, ev:"CONFIRMED", p:[19],
    tg:["owl","ceremony","elite","california","cremation-of-care"],
    d:"2,700-acre private campground. Annual elite gathering.",
    dt:"30-foot owl statue. 'Cremation of Care' ceremony since 1929. Members include former presidents, CEOs, media executives. Alex Jones infiltrated in 2000. US Capitol aerial view also resembles owl. [Part 19, pg 30-38]" },

  // ═══ CONCEPTS / PATTERNS ═══
  { id:"fake_news", l:"'Fake News' Narrative", cl:"CON", x:450, y:360, sz:22, ev:"CONFIRMED", p:[13,19,20,24,25,26],
    tg:["counter-narrative","google-trends","weaponized","clinton","simultaneous"],
    d:"The term 'fake news' was weaponized specifically to counter PizzaGate research. Google Trends shows both terms rising simultaneously from Nov 2016.",
    dt:"ORIGIN & TIMING: The term 'fake news' did not exist in mainstream discourse before Nov 2016. Google Search Trends show 'fake news' and 'pizzagate' rising simultaneously — not sequentially. This means the counter-narrative was deployed at the same moment as the investigation emerged. [Part 13, pg 28-32; Part 24, pg 5-15]\n\nCLINTON DEPLOYMENT: Hillary Clinton's campaign and allies (including Philippe Reines, David Brock/Media Matters) aggressively promoted the label. Clinton referenced it in her May 2017 Wellesley speech without naming PizzaGate directly. [Part 13, pg 30-32; Part 25, pg 48-50]\n\nMEDIA ADOPTION: BBC, NYT, CNN, Guardian simultaneously adopted 'fake news' framing without independent investigation. BuzzFeed used it to call for YouTube censorship. [Part 13, pg 28-30; Part 26, pg 25-30]\n\nGOOGLE MANIPULATION: Part 24 documents how Google Search Trends were potentially manipulated to show declining interest in PizzaGate while 'fake news' rose. The researcher demonstrates specific anomalies in Google's trend data. [Part 24, pg 5-15]\n\nRESULT: The term was so effective it became a permanent fixture in political discourse — the single most successful information warfare operation of the 2016 era. It reframed legitimate investigation as dangerous misinformation. [Part 19, pg 10-15; Part 20, pg 35-38]" },

  { id:"coded_lang", l:"Coded Language System", cl:"CON", x:480, y:280, sz:18, ev:"MODERATE", p:[1,12,13,14,29],
    tg:["pizza","hotdog","walnut-sauce","pasta","cheese","fbi-symbols","handkerchief"],
    d:"Pattern of food-coded language in Podesta emails matching known pedophile terminology, plus FBI-documented pedophile symbols found in associated locations.",
    dt:"PODESTA EMAILS: Terms used in contexts that don't reference actual food: 'pizza,' 'hotdogs,' 'pasta,' 'walnut sauce,' 'cheese,' 'dominos,' 'map' (on a handkerchief). When read as food references, the emails make no sense; when read as code, they follow consistent internal logic. [Part 1, pg 3-6; Part 29, pg 8-15]\n\nFBI SYMBOLS: FBI published pedophile symbols document Jan 31, 2007. BoyLover (triangle spiral), GirlLover (heart spiral), ChildLover logos. These symbols were found on/near businesses in the Comet Ping Pong area. [Part 12, pg 3-12]\n\nNYT CONTRADICTION: Eichenwald's own 2006 NYT investigation thoroughly documented FBI pedophile symbols. The SAME NYT then dismissed those symbols as 'common shapes' in 2016 when found near Comet Ping Pong. [Part 13, pg 15-27; Part 14, pg 3-10]\n\nONLINE SLANG: 'Cheese Pizza' = CP = Child Pornography in internet slang. This code predates PizzaGate by years. [Part 12, pg 12-14; Part 32, pg 30-35]\n\nPEDOPHILE ORGANIZATIONS: Eichenwald's NYT series documented elaborate online infrastructure — radio stations, charities, pendants, coins. [Part 13, pg 15-27; Part 14, pg 3-15]" },

  { id:"blackmail_sys", l:"Intelligence Blackmail System", cl:"CON", x:100, y:320, sz:22, ev:"HIGH", p:[14,16,17,18,22,24,29],
    tg:["mi5","cia","kincora","livingstone","vault7","clearances","hastert","pattern"],
    d:"Documented system where intelligence agencies identify pedophilic individuals, record their activities, and use footage as leverage to control them in positions of power.",
    dt:"KEN LIVINGSTONE (AUDIO): Former Mayor of London confirming MI5 filmed child abuse at Kincora Boys Home for political blackmail. 'Going on for decades and decades.' [Part 18, pg 25-30]\n\nVAULT 7: CIA has universal device access — unlimited blackmail material capability. UMBRAGE program allows false attribution. [Part 18, pg 3-18]\n\nHASTERT: Speaker of the House was serial child molester for decades. NSA/CIA/FBI either didn't know (catastrophic failure), knew and didn't act (complicity), or knew and USED it (confirms system). [Part 18, pg 20-28]\n\nCERNOVICH INSIDER: Sources describe self-reinforcing system where compromised individuals grant clearances to other compromised individuals. [Part 17, pg 22-24]\n\nBILL MALONEY: Described CIA/MI5 methodology: identify → record → blackmail → control. [Part 18, pg 25-28]\n\nEPSTEIN MODEL: Island operation with recording capability mirrors classic intel blackmail. [Part 17, pg 18-22; Part 22, pg 35-38]\n\nBROCK $850K: If Media Matters founder is blackmail victim, explains aggressive PizzaGate attacks. [Part 28, pg 25-40]\n\nTRUMP SPEECH: 'Something else' controlling politicians — widely interpreted as pedophilia blackmail. [Part 13, pg 5-7]" },

  { id:"posthumous", l:"Posthumous Exposure Pattern", cl:"CON", x:920, y:100, sz:18, ev:"CONFIRMED", p:[8,14,30],
    tg:["freud","savile","heath","pattern","death","protected-alive"],
    d:"Documented pattern: pedophiles in power are exposed ONLY after death, preventing them from naming handlers or co-conspirators.",
    dt:"THE PATTERN: Sir Clement Freud — died 2009, exposed 2016 (7 years). Jimmy Savile — died 2011, exposed 2012. Sir Edward Heath — died 2005, investigated 2015+. [Part 8, pg 16; Part 14, pg 10-15, 25-28; Part 30, pg 45-48]\n\nWHY: If pedophiles in power were exposed WHILE alive, they could: name their handlers, identify who supplied children, reveal the blackmail system, implicate intelligence agencies. Death prevents all testimony. [Part 14, pg 26-28; Part 30, pg 48-50]\n\nEPSTEIN EXCEPTION: Found dead before he could testify. Multiple irregularities (guards asleep, cameras malfunctioned). Death may have been the pattern enforced rather than natural. [Part 22, pg 38-42]\n\nIMPLICATION: The posthumous pattern is itself evidence of a protection system — pedophiles are protected while they serve the blackmail function and exposed only when they can no longer incriminate the system. [Part 14, pg 28; Part 30, pg 50-51]" },

  { id:"censorship_sys", l:"Platform Censorship Apparatus", cl:"CON", x:200, y:20, sz:20, ev:"CONFIRMED", p:[17,19,20,24,26,32],
    tg:["youtube","twitter","reddit","google","buzzfeed","demonetization","banning"],
    d:"Coordinated multi-platform censorship of PizzaGate research across YouTube, Twitter, Reddit, Google, and alternative platforms.",
    dt:"REDDIT: r/pizzagate banned Nov 2016. Researcher banned from r/Conspiracy for Luzzatto research. [Part 19, pg 8-12; Part 32, pg 70-80]\n\nYOUTUBE: Live streams of DC protest censored. PizzaGate researcher channels demonetized/deleted. BuzzFeed explicitly called for YouTube censorship using Media Matters framing. [Part 19, pg 6-10; Part 20, pg 35-38; Part 26, pg 25-30]\n\nTWITTER: Brian Podesta/NCMEC tweets censored. PizzaGate researcher accounts suspended. Bill Moran's account suspended after Eichenwald exposé. [Part 17, pg 18-20]\n\nGOOGLE: Google Search Trends anomalies suggest manipulation of PizzaGate interest data. Cernovich advocated peaceful protests at Google HQ against censorship. [Part 24, pg 5-15]\n\nCROWDFUNDING: Craig Sawyer's anti-trafficking fundraiser blocked by GoFundMe and YouCaring. [Part 21, pg 50-65]\n\nPATTERN: Censorship is coordinated across ostensibly independent platforms — suggesting central direction rather than independent editorial decisions. [Part 19, pg 12-15; Part 32, pg 80-85]" },

  { id:"pedo_norm", l:"Pedophilia Normalization", cl:"CON", x:50, y:40, sz:16, ev:"HIGH", p:[13,14,23],
    tg:["academia","media","online","organizations","bill-nye","salon","tedx"],
    d:"Documented push to normalize pedophilia through academic papers, media framing, and online communities.",
    dt:"ACADEMIC: Multiple academic papers and TED/TEDx talks framing pedophilia as a 'sexual orientation' rather than criminal behavior. [Part 23, pg 5-15]\n\nMEDIA: Salon published sympathetic articles about 'virtuous pedophiles.' Subsequent articles removed after PizzaGate scrutiny. [Part 23, pg 15-18]\n\nEICHENWALD NYT SERIES: Documented online pedophile infrastructure including radio shows, chat rooms, and organizations pushing normalization — discussing 'benefits of age difference,' 'children's sexual autonomy,' and 'misrepresentation in news media.' [Part 13, pg 20-27; Part 14, pg 3-15]\n\nBILL NYE: Referenced in Part 23 in context of cultural normalization of sexual boundaries. [Part 23, pg 25-30]\n\nORGANIZATIONS: NAMBLA (North American Man/Boy Love Association) linked to Berkeley ANTIFA group with ties to the mayor. [Part 24, pg 2-5]\n\nPATTERN: Normalization serves as a 'soft' cover for institutional pedophilia — if pedophilia becomes accepted, the blackmail system loses its leverage, but the abuse continues unpunished. [Part 23, pg 30-37]" },

  { id:"meme_war", l:"Meme Warfare / Memetics", cl:"CON", x:460, y:170, sz:16, ev:"CONFIRMED", p:[19],
    tg:["information-warfare","protest","dc","memetics","psychological","counter-narrative"],
    d:"The use of memetic warfare (viral information propagation) as both attack and defense mechanism in the PizzaGate information war.",
    dt:"PART 19: Dedicated to 'Meme Warfare / Memetics' as information warfare tool. Analyzes how memes propagate information faster than traditional media can suppress it. [Part 19, pg 15-30]\n\nDC PROTEST (March 25, 2017): Physical protest at Lafayette Park demonstrated that physical action can break through digital censorship. Google Search Trends showed 'pizzagate' temporarily overtaking 'fake news.' [Part 19, pg 2-8; Part 20, pg 30-35]\n\nCOUNTER-NARRATIVE: The 'fake news' label was itself a meme — deployed to counter PizzaGate memes. The battle between 'fake news' and 'PizzaGate' in search trends represents memetic warfare in real-time. [Part 19, pg 15-25]\n\nWASHINGTON DC SYMBOLISM: Part 19 explores illuminati symbolism in Washington DC's architectural layout — owl shapes, pentagonal structures. [Part 19, pg 35-41]" },

  { id:"psyop", l:"Psychological Operations", cl:"CON", x:160, y:260, sz:18, ev:"HIGH", p:[7,16,18,19,24,29],
    tg:["research-methods","controlled-opposition","disinfo","diversion","limited-hangout"],
    d:"Identified psychological operation patterns: controlled opposition, limited hangouts, disinformation agents, and strategic diversions.",
    dt:"CONTROLLED OPPOSITION: Researcher assesses WikiLeaks as 'likely controlled opposition' — 'mainstream media of leaks' releasing what intelligence wants released. [Part 29, pg 55-70]\n\nRESEARCH ADVICE (Part 7): Researcher dedicated entire part to teaching critical research methodology — how to identify disinfo, verify sources, avoid traps. [Part 7, pg 1-4]\n\nCATHERINE AGNEW: Bizarre Twitter accounts discovered (or planted as disinformation) dating to 2011 implicating Podestas with murder and organ selling. Researcher questions whether these were planted to make investigators look foolish. [Part 13, pg 5-12]\n\nCOMET SHOOTING: Edgar Welch incident used to discredit all research. Researcher notes irregularities. One round hit a computer hard drive — convenient destruction of evidence or coincidence? [Part 20, pg 18-22]\n\nALEX JONES APOLOGY: Jones forced to retract. Could serve as controlled demolition of PizzaGate's most prominent media voice. [Part 20, pg 22-28]\n\nLIMITED HANGOUT: Pattern where partial truth is released to prevent full truth from emerging. Savile exposure may have been a limited hangout preventing exposure of living, active network. [Part 29, pg 60-65]" },

  { id:"search_manip", l:"Google Search Manipulation", cl:"CON", x:500, y:420, sz:14, ev:"MODERATE", p:[24],
    tg:["google-trends","algorithms","data-anomalies","suppression","autocomplete"],
    d:"Documented anomalies in Google Search Trends data for 'PizzaGate' suggesting algorithmic suppression or data manipulation.",
    dt:"MISLEADING TRENDS: Part 24 documents specific anomalies in Google's trend data for PizzaGate. The researcher demonstrates how relative search interest data can be misleading when Google's algorithms modify what results are shown. [Part 24, pg 5-15]\n\nAUTOCOMPLETE: Google autocomplete was observed suppressing PizzaGate-related search suggestions, even when search volume was high. [Part 24, pg 10-12]\n\nCOMPARISON: When compared to other controversial topics, PizzaGate showed unusual patterns in how quickly search interest appeared to 'decline' — potentially indicating algorithmic intervention rather than organic decline. [Part 24, pg 12-18]\n\nIMPLICATION: If Google can manipulate what appears to be declining public interest, this creates a self-fulfilling narrative: 'nobody cares about PizzaGate anymore' becomes true because Google makes it appear true. [Part 24, pg 18-23]" },

  { id:"media_coverup", l:"Systematic Media Cover-Up", cl:"CON", x:700, y:100, sz:20, ev:"CONFIRMED", p:[1,5,6,8,13,14,25,26,30],
    tg:["bbc","nyt","guardian","zero-coverage","pattern","all-parts"],
    d:"Documented pattern where mainstream media provides ZERO coverage of verified evidence while simultaneously promoting 'fake news' counter-narrative.",
    dt:"EVERY PART documents media cover-up. Key examples:\n\nGASPAR STATEMENTS: Sworn testimony from two NHS doctors about David Payne's sexual gestures re: children. ZERO coverage on BBC, Guardian, Telegraph. [Part 5, pg 18-20]\n\nYVONNE MARTIN: 25-year child protection veteran's testimony. ZERO coverage. [Part 6, pg 14]\n\nEICHENWALD: Federal court records documenting 22+ child porn accesses, payments to minors, admin access. ZERO prosecution, ZERO meaningful coverage. [Part 15, pg 15-20]\n\nNYT FLIP: Same NYT published Eichenwald's thorough 2006 investigation into FBI pedophile symbols, then in 2016 dismissed those same symbols as 'common shapes.' [Part 13, pg 15-27; Part 14, pg 3-10]\n\nPALESTINE: 2006 Clinton audio proposing to rig elections. ZERO coverage. [Part 25, pg 40-45]\n\nSCOTLAND YARD NEW LEAD: Dec 2016 announcement about traffickers. NYT, CNN, Guardian did NOT report. [Part 30, pg 40-42]\n\nPATTERN: The media does not merely fail to investigate — it ACTIVELY suppresses. The consistency across all major outlets suggests coordination, not independent editorial judgment. [Part 13, pg 28-32; Part 25, pg 50-55; Part 26, pg 15-30]" },

  { id:"kl", l:"Ken Livingstone", cl:"WHI", x:960, y:320, sz:20, ev:"CONFIRMED", p:[18],
    tg:["audio","mi5","kincora","blackmail","parliament","mayor"],
    d:"Former Mayor of London. Made the most important statement in the dossier.",
    dt:"RECORDED AUDIO: 'I was raising in parliament against Mrs Thatcher the Kincora Boys Home where boys were being abused and MI5 was filming it because they were hoping to blackmail senior politicians.' Confirms: (1) MI5 knew, (2) MI5 FILMED it, (3) Purpose was blackmail, (4) Pattern is 'decades and decades.' [Part 18, pg 25-30]\n\nNO FOLLOW-UP: Zero formal investigation, zero MSM investigation, zero Wikipedia mention, zero parliamentary inquiry. [Part 18, pg 30]" },

  // ═══ PART 31: HOLLYWOOD / WEINSTEIN ═══
  { id:"weinstein", l:"Harvey Weinstein", cl:"PED", x:170, y:500, sz:22, ev:"CONFIRMED", p:[31],
    tg:["convicted","hollywood","clinton-donor","nyt-suppression","pedowood","miramax"],
    d:"Hollywood producer. Co-founder of Miramax and The Weinstein Company. Convicted of rape and sexual assault. Longtime Clinton donor and friend.",
    dt:"CONVICTIONS: Convicted in February 2020 of criminal sexual assault and rape in the third degree. Sentenced to 23 years. Over 80 women accused him of various forms of sexual harassment and assault. [Part 31, pg 3-15]\n\n2004 NYT SUPPRESSION: Former NYT reporter Sharon Waxman reported that she had a 2004 story about Weinstein's sexual predation that was 'gutted' by the Times. Weinstein personally visited the newsroom to pressure editors. Matt Damon and Russell Crowe called Waxman directly to vouch for Weinstein's associates. The story was buried in the Culture section, stripped of all sexual misconduct references. [Part 31, pg 8-15]\n\nCLINTON TIES: Longtime friend and major donor to Bill and Hillary Clinton. Long-term ties to Matt Damon and Ben Affleck. Rose McGowan publicly confronted Affleck for his knowledge of Weinstein's behavior. [Part 31, pg 25-35]\n\nMALIA OBAMA: Barack Obama's daughter Malia was an intern for both Weinstein and Lena Dunham. [Part 31, pg 35-40]\n\nPATTERN: Weinstein's decades of protected abuse follows the same pattern as Savile/Freud/Heath: institutional protection while useful, exposure only when the system decides. The NYT — which suppressed his story in 2004 — then broke the story in 2017. [Part 31, pg 10-15]",
    counter:"Weinstein was convicted in court. His connections to Clintons were political donations common in Hollywood. The NYT ultimately broke the story." },

  { id:"waxman", l:"Sharon Waxman", cl:"WHI", x:80, y:540, sz:12, ev:"CONFIRMED", p:[31],
    tg:["nyt","suppressed","2004","weinstein","journalist"],
    d:"Former NYT reporter. Accused NYT of suppressing her 2004 Weinstein exposé under pressure from Weinstein and Hollywood celebrities.",
    dt:"2004 STORY: Had people on the record about Weinstein's procurer Fabrizio Lombardo. Tracked down a London woman paid off after an unwanted sexual encounter with Weinstein (NDA prevented her speaking). After intense pressure from Weinstein — including Matt Damon and Russell Crowe calling directly to vouch for Lombardo — the story was gutted and buried. [Part 31, pg 8-15]\n\nNYT AS ENABLER: Waxman later wrote that NYT was one of Weinstein's 'enablers' who built his empire on positive press clippings. The same NYT that suppressed Weinstein in 2004 then claimed heroism for exposing him in 2017. [Part 31, pg 11-15]\n\nPATTERN: NYT suppressed Eichenwald's child porn involvement AND Weinstein's sexual predation — same institution protecting different predators. [Part 31, pg 12; Part 15, pg 15-18]" },

  { id:"schneider", l:"Dan Schneider", cl:"PED", x:50, y:450, sz:14, ev:"HIGH", p:[31],
    tg:["nickelodeon","children","feet","investigation","hollywood"],
    d:"Television producer. Created multiple Nickelodeon shows with child actors. Subject of widespread allegations.",
    dt:"NICKELODEON: Created and produced numerous popular shows featuring child actors including iCarly, Victorious, The Amanda Show, Zoey 101, Drake & Josh, and others. Gave him consistent, decades-long access to child actors. [Part 31, pg 110-115]\n\nALLEGATIONS: Widespread online allegations about inappropriate behavior with child actors. Documented pattern of unusual focus on feet of underage performers. The researcher notes: 'Creepy Dan Schneider, he needs to be investigated ASAP!' [Part 31, pg 3, 110-115]\n\nPARTED FROM NICKELODEON: Eventually parted ways with Nickelodeon in 2018 amid public pressure. [Part 31, pg 110-115]" },

  { id:"polanski", l:"Roman Polanski", cl:"PED", x:30, y:500, sz:14, ev:"CONFIRMED", p:[31],
    tg:["convicted","fugitive","standing-ovation","hollywood","child-rapist"],
    d:"Film director. Convicted child rapist who fled the US. Received standing ovation from Hollywood peers.",
    dt:"CONVICTION: In 1977, pleaded guilty to unlawful sex with a minor (13-year-old girl). Fled the US before sentencing and has lived as a fugitive in Europe ever since. [Part 31, pg 115-118]\n\nSTANDING OVATION: Received a standing ovation at the 2003 Academy Awards (won Best Director for The Pianist). Hollywood peers applauded a convicted child rapist — while later erasing alleged rapist Weinstein. The double standard is itself evidence of the protection system. [Part 31, pg 115-118]\n\nFUGITIVE STATUS: Multiple countries have declined extradition. France, Poland, and Switzerland have all protected him. This demonstrates that the protection of powerful pedophiles operates internationally. [Part 31, pg 118-120]" },

  { id:"pedowood", l:"Hollywood / #PedoWood", cl:"CON", x:80, y:580, sz:18, ev:"HIGH", p:[31],
    tg:["weinstein","schneider","polanski","feldman","open-secret","systemic"],
    d:"Systemic sexual abuse and pedophilia in the Hollywood entertainment industry, documented through multiple victim testimonies, convictions, and institutional cover-ups.",
    dt:"VICTIM TESTIMONIES: Part 31 documents Hollywood victims who spoke out:\n\n• COREY FELDMAN: Child actor who has repeatedly stated pedophilia is Hollywood's biggest problem. Described being abused as a child actor alongside Corey Haim. [Part 31, pg 55-65]\n\n• ROB SCHNEIDER: Described an encounter with a 'gross' producer (implied Weinstein) who wore a bathrobe and asked for a massage. [Part 31, pg 65-71]\n\n• KAYA JONES: Former Pussycat Dolls member. Spoke out about exploitation and control within the music industry. Wikipedia article about her was altered to discredit her claims (researcher documents this as 'Orwellian Wikipedia'). [Part 31, pg 71-80]\n\n• REESE WITHERSPOON: Publicly stated she was sexually assaulted by a director at age 16. [Part 31, pg 85-95]\n\n• ELIJAH WOOD: Stated there are pedophiles in Hollywood's highest circles. [Part 31, pg 55-60]\n\n• ROSE McGOWAN: Publicly confronted Ben Affleck about his knowledge of Weinstein. [Part 31, pg 95-105]\n\n• TERRY CREWS: Physical assault by Hollywood agent. [Part 31, pg 55-60]\n\n• JAMES VAN DER BEEK: Described being groped by 'older, powerful men.' [Part 31, pg 55-60]\n\nAN OPEN SECRET (2014): Documentary exposing pedophilia in Hollywood, featuring multiple victim testimonies. [Part 31, pg 120-125]\n\nBRIAN PECK: Convicted pedophile rapist who still gets to work with underage kids in Hollywood. [Part 31, pg 110-115]\n\nPATTERN: Same as political/religious institutions — position of power + access to children + institutional protection + decades of abuse. Hollywood adds: career blackmail (speak up = career over). [Part 31, pg 125-127]" },

  // ═══ V8: SUSPICIOUS DEATHS ═══
  { id:"susp_deaths", l:"Suspicious Deaths Pattern", cl:"DTH", x:560, y:560, sz:22, ev:"HIGH", p:[20,25,31],
    tg:["seth-rich","shawn-lucas","breitbart","leyland","moran","whisenant","pattern","silenced"],
    d:"Documented pattern of individuals dying under suspicious circumstances after possessing or pursuing information compromising to powerful networks.",
    dt:"THE PATTERN: Multiple individuals connected to PizzaGate research, DNC leaks, or pedophile network investigations died under unusual circumstances:\n\n• SETH RICH: DNC staffer murdered July 10, 2016 in 'botched robbery' where nothing was stolen. $250K reward by OAN. Kim Dotcom claims knowledge of WikiLeaks connection. DC police chief socialized with DNC officials. [Part 25, pg 2-4]\n\n• SHAWN LUCAS: DNC lawsuit process server found dead August 2, 2016 of 'powerful mix of drugs.' Served papers on DNC/Debbie Wasserman Schultz. [Part 25, pg 3]\n\n• ANDREW BREITBART: Died unexpectedly March 1, 2012, age 43. Had tweeted about Podesta and underage sex trafficking cover-up. Founded BigGovernment.com which premiered ACORN sting. [Part 20]\n\n• BRENDA LEYLAND: Found dead October 4, 2014 at Marriott hotel (helium inhalation). Days after Sky News ambush for McCann-critical tweets. No prior mental illness. [Part 25, pg 30-42]\n\n• BILL MORAN: Journalist who exposed Eichenwald via court records. Article removed from Medium. Twitter suspended. Reported dead. [Part 15, pg 18-20; Part 17, pg 8-10]\n\n• BERANTON WHISENANT: Federal prosecutor found dead on beach in Debbie Wasserman Schultz's district. [Part 25]\n\nIMPLICATION: Pattern of silencing creates chilling effect. Combined with Tony Bennett's prison sentence and platform censorship, demonstrates multi-layered suppression: legal threats, career destruction, and suspicious deaths." },

  { id:"seth_rich", l:"Seth Rich", cl:"DTH", x:480, y:600, sz:16, ev:"UNVERIFIED", p:[25],
    tg:["dnc","murdered","robbery","wikileaks","unsolved","reward"],
    d:"DNC staffer murdered July 10, 2016. Nothing stolen. Death connected to WikiLeaks source theory.",
    dt:"MURDER: Shot twice in the back at 4:19 AM on July 10, 2016 in Washington DC. Officially classified as 'botched robbery' but wallet, phone, keys, watch not taken. [Part 25, pg 2-4]\n\nREWARD: OAN offered $250,000 for information. WikiLeaks offered $20,000. Julian Assange implied Rich was source without confirming. [Part 25, pg 2]\n\nKIM DOTCOM: Wrote open letter to Rich family claiming knowledge of WikiLeaks/DNC connection. [Part 25]\n\nDC POLICE: Chief socialized with DNC officials. Security footage missing or withheld. [Part 25, pg 3-4]\n\nASSESSMENT: UNVERIFIED connection to WikiLeaks. However, the pattern of unsolved murder + nothing stolen + potential DNC leak source is consistent with silencing." },

  { id:"shawn_lucas", l:"Shawn Lucas", cl:"DTH", x:400, y:620, sz:12, ev:"UNVERIFIED", p:[25],
    tg:["dnc-lawsuit","dead","drugs","process-server","wasserman-schultz"],
    d:"Process server for DNC fraud lawsuit. Found dead August 2, 2016.",
    dt:"DEATH: Found dead on bathroom floor August 2, 2016. Cause: 'combined effects of fentanyl, cyclobenzaprine, and mitragynine' (kratom). Served legal papers on DNC and Debbie Wasserman Schultz for fraud lawsuit on behalf of Bernie Sanders supporters. [Part 25, pg 3]\n\nTIMING: Died less than a month after Seth Rich murder. Both connected to DNC. [Part 25]" },

  { id:"breitbart", l:"Andrew Breitbart", cl:"DTH", x:320, y:580, sz:16, ev:"HIGH", p:[19,20],
    tg:["dead","podesta","tweet","biggovernment","acorn","heart-attack","43"],
    d:"Conservative media founder. Died unexpectedly March 1, 2012, age 43. Had tweeted about Podesta.",
    dt:"TWEET (Feb 4, 2011): Tweeted about John Podesta and underage sex trafficking cover-up — years before PizzaGate. 'How prog-guru John Podesta isn't household name as world class underage sex slave op cover-upper defending unspeakable dregs is beyond me.' [Part 20]\n\nDEATH: Died March 1, 2012, walking near home. Cause: heart failure. Age 43. Coroner's office employee Michael Cormier died of suspected arsenic poisoning on the day Breitbart's autopsy results were released. [Part 20]\n\nLEGACY: Founded BigGovernment.com which premiered the Project Veritas ACORN sting. [Part 2; Part 20]\n\nASSESSMENT: HIGH — the tweet is documented, the death timing is notable, and the coroner employee death adds circumstantial weight." },

  { id:"whisenant", l:"Beranton Whisenant", cl:"DTH", x:360, y:640, sz:10, ev:"UNVERIFIED", p:[25],
    tg:["prosecutor","dead","beach","wasserman-schultz","district"],
    d:"Federal prosecutor found dead on beach in Debbie Wasserman Schultz's congressional district.",
    dt:"DEATH: Body found on Hollywood, Florida beach May 24, 2017. Federal prosecutor in the visa and passport fraud section. Located in Debbie Wasserman Schultz's district. [Part 25]\n\nASSESSMENT: UNVERIFIED connection to broader pattern. Included due to timing, location, and professional role." },

  // ═══ V8: EICHENWALD VICTIM ═══
  { id:"berry", l:"Justin Berry", cl:"PED", x:180, y:140, sz:16, ev:"CONFIRMED", p:[13,14,15],
    tg:["victim","minor","eichenwald","webcam","payment","2000-check","14-years-old","nyt"],
    d:"Victim at center of Eichenwald case. 14-year-old who received $300 from Eichenwald's $2,000 check for CP production.",
    dt:"VICTIMIZATION: Berry began performing on webcam at age 13. By 14, was being paid by multiple adults including Kurt Eichenwald. Eichenwald sent $2,000 Bank of America cashier's check; $300 was used same day to pay Berry for CP video production. [Part 15, pg 3-10]\n\nEICHENWALD DEFENSE: Eichenwald claimed the $2,000 was to help Berry 'escape' the webcam world. Federal court records contradict this — $300 went to CP production the same day. [Part 15, pg 10-15]\n\nNYT INVOLVEMENT: NYT published Eichenwald's 2005 article 'Through His Webcam, a Boy Joins a Sordid Online World' about Berry — WITHOUT disclosing Eichenwald's own $2,000 payment or 22+ accesses to Berry's content. [Part 14, pg 3-5]\n\nPAYPAL: Additional payments under alias 'Andrew McDonald' totaling $1,184+. Admin access ('Roy Rogers') on JustinsFriends.com. [Part 15, pg 10-15]\n\nNO PROSECUTION: Despite federal court documentation of all the above, Eichenwald was never charged. [Part 15, pg 15-18]" },

  // ═══ V8: HOLLYWOOD ENABLERS ═══
  { id:"damon", l:"Matt Damon", cl:"MED", x:100, y:560, sz:14, ev:"CONFIRMED", p:[31],
    tg:["weinstein","waxman","lombardo","camp-david","clinton","suppression","enabler"],
    d:"Actor. Called Sharon Waxman at Weinstein's request to vouch for procurer Fabrizio Lombardo. Camp David with Weinstein and Clinton 1998.",
    dt:"WAXMAN CALL: Called NYT reporter Sharon Waxman at Harvey Weinstein's request to vouch for Fabrizio Lombardo (Weinstein's alleged procurer of women in Italy). Waxman's 2004 exposé was subsequently gutted by NYT. Damon confirmed the call but claimed he 'wasn't informed' about investigative aspects. [Part 31, pg 8-15]\n\nCAMP DAVID 1998: Photos surfaced of Weinstein, Damon, Ben Affleck, and Bill Clinton at Camp David screening of 'Good Will Hunting.' Clinton Library tweeted archived photo in 2014. [Part 31, pg 12-13]\n\nWAXMAN'S ACCOUNT: 'After intense pressure from Weinstein, which included having Matt Damon and Russell Crowe call me directly to vouch for Lombardo and unknown discussions well above my head at the Times, the story was gutted.' [Part 31, pg 11]" },

  { id:"affleck", l:"Ben Affleck", cl:"MED", x:140, y:600, sz:12, ev:"CONFIRMED", p:[31],
    tg:["weinstein","mcgowan","camp-david","clinton","knowledge","confronted"],
    d:"Actor. Rose McGowan publicly confronted him about knowledge of Weinstein. Camp David 1998.",
    dt:"McGOWAN CONFRONTATION: Rose McGowan publicly tweeted at Affleck that she told him about Weinstein and he did nothing. 'I told him to stop doing that. He said he would. I was a kid.' [Part 31, pg 95-105]\n\nCAMP DAVID: Present at 1998 Camp David screening with Weinstein, Damon, and Bill Clinton. [Part 31, pg 12-13]\n\nACCUSATIONS: Affleck, Damon, and Russell Crowe all accused of helping suppress Weinstein coverage. [Part 31, pg 95-105]" },

  { id:"lombardo", l:"Fabrizio Lombardo", cl:"PED", x:60, y:520, sz:12, ev:"HIGH", p:[31],
    tg:["weinstein","procurer","italy","waxman","damon","miramax"],
    d:"Weinstein's alleged procurer of women in Italy. Subject of suppressed 2004 NYT story.",
    dt:"ROLE: Head of Miramax Italy. Sharon Waxman's investigation found he had 'icherous women into seeing Weinstein.' Waxman tracked down a London woman paid off after unwanted sexual encounter with Weinstein (NDA prevented speaking). [Part 31, pg 8-12]\n\nSUPPRESSION: Damon and Crowe called Waxman to vouch for Lombardo. Disney told Waxman they had 'no idea Lombardo existed.' Story gutted by NYT. [Part 31, pg 11-15]\n\nSALARY: On Miramax payroll for 'hundreds of thousands of dollars' according to Waxman. [Part 31, pg 11]" },

  { id:"b_peck", l:"Brian Peck", cl:"PED", x:20, y:560, sz:12, ev:"CONFIRMED", p:[31],
    tg:["convicted","pedophile","hollywood","nickelodeon","working-with-children"],
    d:"Convicted pedophile rapist who continued working with underage children in Hollywood.",
    dt:"CONVICTION: Convicted pedophile rapist. Despite conviction, continued to get work with underage children in Hollywood. [Part 31, pg 110-115]\n\nPATTERN: Demonstrates Hollywood's institutional protection — even CONVICTED pedophiles maintain access to children. [Part 31, pg 110-115]" },

  { id:"feldman", l:"Corey Feldman", cl:"WHI", x:30, y:470, sz:16, ev:"CONFIRMED", p:[31],
    tg:["child-actor","haim","pedophilia","barbara-walters","decades","hollywood-victim"],
    d:"Child actor who called pedophilia Hollywood's biggest problem. Abused alongside Corey Haim.",
    dt:"TESTIMONY (2011): In August 2011 interview, stated pedophilia is Hollywood's biggest secret. He and best friend Corey Haim were victims. Described being molested by 'Ron' who worked as assistant to his father. [Part 31, pg 55-65]\n\nBARBARA WALTERS: On The View, Walters scolded Feldman: 'You're damaging an entire industry!' when he tried to expose Hollywood pedophilia. [Part 31, pg 60-65]\n\nCOREY HAIM: Best friend and fellow child actor. Died in 2010 after struggling with addiction linked to childhood abuse. Feldman has stated 'Haim was raped as an 11-year-old.' [Part 31, pg 55-65]\n\nMICHAEL JACKSON: Feldman defended Jackson, stating Jackson never abused him — interesting given Feldman's willingness to name other abusers. [Part 31, pg 65]" },

  { id:"kaya", l:"Kaya Jones", cl:"WHI", x:50, y:420, sz:12, ev:"MODERATE", p:[31],
    tg:["pussycat-dolls","prostitution-ring","wikipedia-altered","industry","silenced"],
    d:"Former Pussycat Dolls member. Called group a 'prostitution ring.' Wikipedia altered to discredit.",
    dt:"ALLEGATIONS: Took to Twitter to allege Pussycat Dolls were a 'prostitution ring.' Stated members were exploited and controlled. [Part 31, pg 71-80]\n\nWIKIPEDIA: Researcher documents how Jones' Wikipedia article was altered to discredit her claims — labels this 'Orwellian Wikipedia.' Robin Antin (founder) attacked Jones publicly rather than supporting her claims. [Part 31, pg 71-80]\n\nCONNECTION: Featured on Corey Feldman's 2016 album, linking two Hollywood abuse whistleblowers. [Part 31, pg 80]" },

  { id:"argento", l:"Asia Argento", cl:"WHI", x:120, y:520, sz:12, ev:"CONFIRMED", p:[31],
    tg:["weinstein","rape","farrow","italian","20-years"],
    d:"Italian actress. Stated Weinstein forcibly performed oral sex on her. Spoke to Ronan Farrow.",
    dt:"TESTIMONY: Told Ronan Farrow that Weinstein forcibly performed oral sex on her. Did not speak out for 20 years because she feared Weinstein would 'crush' her. 'I know he has crushed a lot of people before.' [Part 31, pg 6-7]\n\nFARROW INVESTIGATION: One of 13 women who spoke to Farrow during his 10-month New Yorker investigation. [Part 31, pg 6-7]" },

  // ═══ V8: ACORN / VERITAS ═══
  { id:"okeefe", l:"James O'Keefe", cl:"WHI", x:180, y:580, sz:12, ev:"CONFIRMED", p:[2,3],
    tg:["veritas","undercover","acorn","sting","trafficking","7-cities"],
    d:"Project Veritas founder. Undercover ACORN sting in 7 cities exposed trafficking willingness.",
    dt:"ACORN STING (2009): Posed as law student with Hannah Giles. In 6 of 7 cities, ACORN employees willingly assisted hypothetical child sex trafficking ring. Only LA office refused and called police. [Part 2, pg 3-8]\n\nSETTLEMENT: Paid $100,000 settlement to ACORN — commonly cited by critics. Project Veritas website addresses this. [Part 2, pg 8-10]\n\nIMPACT: Led to Congressional defunding of ACORN and eventual shutdown. California AG confirmed employees discussed criminal plan. [Part 2, pg 10-11]" },

  // ═══ V8: MISC NEW NODES ═══
  { id:"welch", l:"Edgar Welch", cl:"CON", x:240, y:100, sz:12, ev:"CONFIRMED", p:[20],
    tg:["comet","shooting","computer","hard-drive","discredit","false-flag"],
    d:"Fired one round at Comet Ping Pong hitting a computer hard drive. MSM used to discredit all research.",
    dt:"SHOOTING (Dec 4, 2016): Entered Comet Ping Pong with AR-15. Fired ONE round which hit a computer hard drive. No injuries. [Part 20, pg 18-22]\n\nMSM RESPONSE: Incident was used by MSM to discredit ALL PizzaGate research. Every subsequent article leads with 'gunman' narrative. [Part 20, pg 20-22]\n\nIRREGULARITIES: Researcher notes: one round hitting a computer hard drive is convenient destruction of potential evidence or remarkable coincidence. IMDB page existed for Welch (actor background). [Part 20, pg 22]" },

  { id:"schwartz", l:"Jacob Schwartz", cl:"PED", x:220, y:440, sz:10, ev:"CONFIRMED", p:[25],
    tg:["deblasio","cp","arrested","young-democrats","6-months-old"],
    d:"NYC Mayor De Blasio staffer arrested May 2017 for child pornography. 3,000+ images, children as young as 6 months.",
    dt:"ARREST: 29-year-old staffer for NYC Mayor Bill De Blasio arrested. NYPD found 3,000+ images and 89 videos depicting sexual acts with children as young as 6 months old. President of Manhattan Young Democrats, VP of NY State Young Democrats. Out on $7,500 bail. [Part 25, pg 4-6]" },

  { id:"icke", l:"David Icke", cl:"WHI", x:980, y:100, sz:14, ev:"UNVERIFIED", p:[14,20,25],
    tg:["heath","trudeau","predictions","decades-early","controversial"],
    d:"Named Sir Edward Heath as pedophile since 1998 — nearly 20 years before police confirmed.",
    dt:"HEATH (1998): Named Heath as pedophile 17 years before Wiltshire Police confirmed '120% genuine' allegations with 30+ victims. [Part 14, pg 25-28]\n\nTRUDEAU: Made claims about Pierre Trudeau similar to Cathy O'Brien. [Part 20, pg 38-40]\n\nASSESSMENT: Overall credibility UNVERIFIED due to broader claims. However, specific Heath prediction was vindicated by police investigation. Demonstrates pattern where 'conspiracy theorists' are confirmed years later. [Part 14, pg 28]" },

  { id:"agnew", l:"Catherine Agnew", cl:"CON", x:440, y:90, sz:10, ev:"UNVERIFIED", p:[13],
    tg:["twitter","2011","podesta","planted","disinformation","murder","organs"],
    d:"Bizarre Twitter accounts from 2011 implicating Podestas. Researcher questions if planted disinfo.",
    dt:"DISCOVERY: Bizarre Twitter accounts dating to 2011 implicating Podestas with murder and organ selling. Researcher explicitly questions whether these were planted to make investigators look foolish — demonstrating critical analytical approach. [Part 13, pg 5-12]\n\nASSESSMENT: UNVERIFIED. May be genuine or deliberate disinformation planted to discredit investigation. Researcher flags this possibility. [Part 13, pg 10-12]" },

  { id:"maccoby", l:"Max Maccoby", cl:"POD", x:580, y:280, sz:10, ev:"MODERATE", p:[29],
    tg:["luzzatto","emails","dc-power","attorney","children"],
    d:"Referenced in Luzzatto/Podesta emails. Connected to DC power network.",
    dt:"EMAILS: Appears in WikiLeaks Podesta email archive in connection with Tamera Luzzatto and children-related events. DC-based attorney. [Part 29]" },

  { id:"brazile", l:"Donna Brazile", cl:"POD", x:340, y:380, sz:10, ev:"CONFIRMED", p:[1],
    tg:["cnn","debate-questions","clinton","fired","wikileaks"],
    d:"CNN analyst fired after WikiLeaks revealed she shared debate questions to Clinton campaign.",
    dt:"FIRED: WikiLeaks revealed Brazile shared CNN debate and interview questions with Hillary Clinton campaign. CNN terminated her. Clinton did not reveal this at the time — the bigger story. [Part 1, pg 13-14]" },

  { id:"rathke", l:"Wade Rathke", cl:"ORG", x:150, y:560, sz:10, ev:"CONFIRMED", p:[2,3],
    tg:["acorn-founder","obama","paper","removed","embezzlement-cover"],
    d:"ACORN founder. Published paper crediting Obama collaboration (later removed from web).",
    dt:"ACORN: Founded ACORN in 1970. Published paper crediting Obama as close collaborator — contradicting Obama's 'Fight the Smears' denial. Paper removed from web but preserved on WikiLeaks. [Part 3, pg 2-8]\n\nEMBEZZLEMENT: Brother Dale embezzled $1-5M. Wade covered it up internally for 8 years. Both continued working at ACORN until 2008 exposure. [Part 2, pg 10-11]" },

  { id:"pieczenik", l:"Steve Pieczenik", cl:"INT", x:280, y:420, sz:10, ev:"MODERATE", p:[13],
    tg:["state-dept","counter-coup","intelligence","clinton"],
    d:"Former Deputy Assistant Secretary of State. Claimed counter-coup against Clinton via intelligence community.",
    dt:"CLAIMS: Former Deputy Assistant Secretary of State under Kissinger, Vance, Baker. Claimed intelligence community was conducting a counter-coup against Clinton via WikiLeaks. [Part 13]" },

  { id:"walters", l:"Barbara Walters", cl:"MED", x:10, y:440, sz:12, ev:"CONFIRMED", p:[31],
    tg:["feldman","scolded","damaging-industry","the-view","suppression"],
    d:"Scolded Corey Feldman on-air for exposing Hollywood pedophilia. 'You're damaging an entire industry!'",
    dt:"THE VIEW: When Corey Feldman tried to expose Hollywood pedophilia on The View, Walters responded: 'You're damaging an entire industry!' Rather than supporting a victim, she prioritized industry reputation. [Part 31, pg 60-65]\n\nPATTERN: Demonstrates how mainstream media figures actively suppress victim testimony — same pattern as BBC suppressing Savile victims, NYT suppressing Waxman's Weinstein story. [Part 31, pg 65]" },
];

// ═══ WITNESS CREDIBILITY MATRIX ═══
const WITNESSES = [
  {id:"gaspar",name:"Gaspar Couple (Dr. Katherina & Dr. Savio)",credentials:"Both NHS General Practitioners. Dundee medical school graduates.",independence:"HIGH — friends of McCanns who testified against their social circle at personal cost",corroboration:"Two independent observations on two occasions. Both consistent. Professional credentials verified on NHS website.",motive:"No apparent motive to fabricate against close friends. Katherina's concern predated disappearance.",ev:"CONFIRMED",p:[5],pg:"pg 3-20"},
  {id:"yvonne",name:"Yvonne Martin",credentials:"25+ years child protection social work across 7 UK localities. CRB certified.",independence:"HIGH — no prior relationship with McCanns or Payne",corroboration:"Formal identification from photographs. Clothing match to police description. Two independent statements (May and Nov 2007).",motive:"Professional duty. No personal connection to any party.",ev:"CONFIRMED",p:[6],pg:"pg 3-14"},
  {id:"hyatt",name:"Peter Hyatt",credentials:"Statement analysis expert. Teaches law enforcement. Used by multiple agencies.",independence:"HIGH — no connection to any party. Analyzed only public statements/book.",corroboration:"Methodology used by law enforcement agencies. Analysis based on established linguistic markers.",motive:"Professional analysis. No personal stake.",ev:"HIGH",p:[5],pg:"pg 10-14"},
  {id:"sf",name:"Smith Family",credentials:"Civilian witnesses. Three family members (2 adults, 1 child).",independence:"HIGH — Irish tourists with no connection to any party",corroboration:"Three witnesses consistent on key details. Adults estimated age 35-40. CCTV from hotel wiped.",motive:"No apparent motive. Cooperated with police.",ev:"HIGH",p:[4,30],pg:"pg 5-12; pg 28-38"},
  {id:"kl",name:"Ken Livingstone",credentials:"Former Mayor of London (2000-2008). Elected politician. Raised in Parliament.",independence:"MODERATE — political figure, Labour party",corroboration:"AUDIO RECORDING EXISTS. Statements about Kincora independently documented by multiple investigations.",motive:"Raised in Parliament against political opponent (Thatcher). Possible political motivation but audio is unambiguous.",ev:"CONFIRMED",p:[18],pg:"pg 25-30"},
  {id:"bernard",name:"Ronald Bernard",credentials:"Self-described former elite banker. No independent verification of claimed role.",independence:"LOW — anonymous claims, single source",corroboration:"No independent corroboration of specific claims. Emotional authenticity noted but insufficient.",motive:"Unknown. Could be genuine whistleblower or fabrication.",ev:"UNVERIFIED",p:[23],pg:"pg 15-25"},
  {id:"waxman",name:"Sharon Waxman",credentials:"Former NYT reporter. Founded TheWrap media outlet.",independence:"HIGH — journalist with byline history",corroboration:"Matt Damon confirmed the phone call. NYT story verifiably exists in diminished form. Weinstein's pattern later confirmed by 80+ accusers.",motive:"Professional vindication after her story was suppressed.",ev:"CONFIRMED",p:[31],pg:"pg 8-15"},
  {id:"amaral",name:"Gonçalo Amaral",credentials:"Senior Polícia Judiciária coordinator. Decades of experience. Led investigation.",independence:"MODERATE — could have professional ego investment",corroboration:"Portuguese Supreme Court validated his right to state professional conclusions. Cadaver dog evidence supports his theory. Multiple forensic findings consistent.",motive:"Professional reputation. Took early retirement to speak freely.",ev:"CONFIRMED",p:[4,5,9,10,30],pg:"pg 3-6; pg 15-18; pg 8-14; pg 22-24; pg 10-18"},
  // ═══ V8: NEW WITNESSES ═══
  {id:"feldman",name:"Corey Feldman",credentials:"Child actor with decades in Hollywood. Personal victim. Named specific abusers.",independence:"HIGH — victim testifying against powerful industry at personal/career cost",corroboration:"Best friend Corey Haim corroborated before death. Multiple other Hollywood victims have since spoken out consistently.",motive:"Personal justice. Career cost demonstrates sincerity.",ev:"CONFIRMED",p:[31],pg:"pg 55-65"},
  {id:"argento",name:"Asia Argento",credentials:"Italian film actress and director. Weinstein victim.",independence:"HIGH — spoke at personal cost after 20 years of fear",corroboration:"Part of 13 women interviewed by Ronan Farrow. Weinstein's pattern confirmed by 80+ accusers. NYPD sting recording exists.",motive:"Justice after two decades. Fear of Weinstein delayed testimony.",ev:"CONFIRMED",p:[31],pg:"pg 6-7"},
  {id:"okeefe_w",name:"James O'Keefe",credentials:"Investigative journalist. Project Veritas founder. Documented undercover methodology.",independence:"LOW — conservative activist with political motivation",corroboration:"Video evidence exists. California AG confirmed employees discussed criminal plan. 6/7 offices documented.",motive:"Political. Anti-ACORN agenda. However, video evidence speaks for itself.",ev:"CONFIRMED",p:[2,3],pg:"pg 3-10"},
  {id:"icke_w",name:"David Icke",credentials:"Author and public speaker. No professional investigative credentials.",independence:"LOW — broader theories reduce credibility",corroboration:"Specific Heath prediction validated by Wiltshire Police 17 years later. 30+ victims confirmed.",motive:"Unknown. Broader agenda may include self-promotion. However, Heath prediction accuracy is notable.",ev:"UNVERIFIED",p:[14],pg:"pg 25-28"},
];

// ═══ FINANCIAL FLOWS ═══
const FINANCES = [
  {from:"David Brock",to:"William Grey",amount:"$850,000",type:"Alleged blackmail",desc:"Court documents reference payment. Context suggests blackmail over compromising material.",p:[28],pg:"pg 25-40",ev:"HIGH"},
  {from:"Kurt Eichenwald",to:"Justin Berry",amount:"$2,000",type:"Check (funded CP production)",desc:"Bank of America cashier's check. Berry used $300 to pay 14-year-old minor for CP video same day.",p:[15],pg:"pg 3-10",ev:"CONFIRMED"},
  {from:"Eichenwald (alias)",to:"Berry/Mitchel",amount:"$1,184+",type:"PayPal payments",desc:"Under alias 'Andrew McDonald.' Referenced image purchases.",p:[15],pg:"pg 10-15",ev:"CONFIRMED"},
  {from:"US Government",to:"ACORN",amount:"$53,000,000+",type:"Federal funding (1994-2009)",desc:"Federal funds to organization whose employees willingly assisted child trafficking scenarios.",p:[2],pg:"pg 10-11",ev:"CONFIRMED"},
  {from:"UK Government",to:"Operation Grange",amount:"£12,000,000+",type:"Investigation funding",desc:"Spent on McCann investigation. Case unsolved. Key witnesses never prominently featured.",p:[30],pg:"pg 35-40",ev:"CONFIRMED"},
  {from:"Dale Rathke",to:"Personal",amount:"$1-5M",type:"Embezzlement from ACORN",desc:"Covered up internally for 8 years. Louisiana AG suggests actual figure was $5M.",p:[2],pg:"pg 10-11",ev:"CONFIRMED"},
  {from:"McCanns",to:"Amaral libel suit",amount:"£1,200,000",type:"Libel claim (lost on appeal)",desc:"Sued Amaral. Won initially €600K. Portuguese Supreme Court reversed — ruled in Amaral's favor.",p:[10],pg:"pg 22-24",ev:"CONFIRMED"},
  {from:"Weinstein",to:"Clinton campaigns",amount:"Multiple donations",type:"Political donations",desc:"Longtime major donor. Close personal relationship with Bill and Hillary Clinton spanning decades.",p:[31],pg:"pg 25-35",ev:"CONFIRMED"},
];

// ═══ GEOGRAPHIC DATA ═══
const GEO = [
  {loc:"Praia da Luz, Portugal",lat:37.088,lon:-8.728,nodes:["mm","km","gm","dp","cf","sf","cm"],desc:"Madeleine McCann disappearance (May 3, 2007). Clement Freud's villa. Smith family sighting.",p:[1,4,5,6,8,9]},
  {loc:"Washington DC, USA",lat:38.907,lon:-77.037,nodes:["ja","comet","hc","jp","db","mm_org","sessions","trump","flynn","seth_rich","welch","schwartz","brazile"],desc:"Comet Ping Pong. Lafayette Park protest. White House. Capitol Hill. Seth Rich murder location.",p:[11,12,19,20,25]},
  {loc:"Dundee, Scotland",lat:56.462,lon:-2.971,nodes:["km","cf","gaspar"],desc:"University of Dundee. Kate McCann attended medical school. Freud was Rector. Gaspar couple studied here.",p:[5,8]},
  {loc:"Dallas, Texas, USA",lat:32.777,lon:-96.797,nodes:["ke"],desc:"Kurt Eichenwald's location. IP address traced here for 22+ child porn accesses.",p:[15]},
  {loc:"Château de Ferrières, France",lat:48.822,lon:2.714,nodes:["rothschild"],desc:"1972 Rothschild Surrealist Ball. Occult-themed event.",p:[27]},
  {loc:"Port-au-Prince, Haiti",lat:18.542,lon:-72.339,nodes:["silsby","cf_org","un"],desc:"Clinton Foundation operations. Laura Silsby arrest. UN peacekeeper trafficking.",p:[22]},
  {loc:"London, UK",lat:51.507,lon:-0.128,nodes:["mi5","sy","kl","savile","heath","leyland"],desc:"MI5 headquarters. Scotland Yard. Ken Livingstone (Mayor). Savile's BBC. Westminster.",p:[14,18,25,30]},
  {loc:"Portimão, Portugal",lat:37.138,lon:-8.537,nodes:["amaral","yvonne"],desc:"Polícia Judiciária office. Amaral's investigation base. Yvonne Martin's statements given here.",p:[4,5,6]},
  {loc:"Monte Rio, California, USA",lat:38.468,lon:-123.010,nodes:["bg"],desc:"Bohemian Grove. 2,700-acre private campground. Annual elite gathering.",p:[19]},
  {loc:"New York City, USA",lat:40.713,lon:-74.006,nodes:["ke","weinstein","waxman","epstein","berry","lombardo","damon","walters"],desc:"NYT headquarters. Weinstein's operations. Epstein's Manhattan residence. Berry victim location.",p:[13,14,15,17,22,31]},
  {loc:"Hollywood, Los Angeles, USA",lat:34.098,lon:-118.326,nodes:["weinstein","schneider","polanski","pedowood","feldman","kaya","b_peck","affleck","argento"],desc:"Entertainment industry center. Weinstein/Miramax. Nickelodeon studios. 'An Open Secret' documentary. Feldman/Kaya testimony.",p:[31]},
  {loc:"Belfast, Northern Ireland",lat:54.597,lon:-5.930,nodes:["mi5"],desc:"Kincora Boys' Home. MI5 filmed child abuse for political blackmail (Livingstone audio).",p:[18]},
];

// ═══ EDGES ═══
const EDGES = [
  {f:"jp",t:"tp",l:"Brothers",ty:"family",w:3,p:[1],cr:false},
  {f:"jp",t:"hc",l:"Campaign Chair",ty:"political",w:3,p:[1],cr:false},
  {f:"jp",t:"ec",l:"Boss → Assistant",ty:"professional",w:2,p:[1],cr:false},
  {f:"jp",t:"tl",l:"Pool entertainment email",ty:"communication",w:3,p:[29],cr:true},
  {f:"jp",t:"bp",l:"Possible relative",ty:"family",w:2,p:[17],cr:false},
  {f:"jp",t:"abramovic",l:"Spirit Cooking invite",ty:"social",w:2,p:[27],cr:false},
  {f:"jp",t:"ja",l:"Fundraiser emails",ty:"communication",w:2,p:[1],cr:false},
  {f:"jp",t:"wl",l:"Emails leaked",ty:"adversarial",w:3,p:[1],cr:false},
  {f:"jp",t:"mm",l:"E-fit + email gap",ty:"suspicious",w:3,p:[1,4,7],cr:true},
  {f:"jp",t:"coded_lang",l:"Anomalous food language",ty:"pattern",w:3,p:[1,29],cr:true},
  {f:"tp",t:"abramovic",l:"Art/social",ty:"social",w:2,p:[27],cr:false},
  {f:"tp",t:"mm",l:"E-fit + mole match",ty:"suspicious",w:2,p:[1,4,7],cr:true},
  {f:"ja",t:"db",l:"Ex-boyfriends",ty:"personal",w:3,p:[26],cr:false},
  {f:"ja",t:"comet",l:"Owner",ty:"professional",w:3,p:[20],cr:false},
  {f:"db",t:"mm_org",l:"Founded",ty:"professional",w:3,p:[26],cr:false},
  {f:"db",t:"hc",l:"Clinton operative",ty:"political",w:2,p:[26],cr:false},
  {f:"db",t:"grey",l:"$850K blackmail suit",ty:"adversarial",w:3,p:[28],cr:true},
  {f:"db",t:"blackmail_sys",l:"Possibly blackmailed",ty:"pattern",w:2,p:[28],cr:true},
  {f:"bc",t:"hc",l:"Married",ty:"family",w:3,p:[],cr:false},
  {f:"bc",t:"epstein",l:"26+ Lolita Express flights",ty:"social",w:3,p:[16],cr:true},
  {f:"bc",t:"acorn",l:"Political ties",ty:"political",w:2,p:[2],cr:false},
  {f:"obama",t:"acorn",l:"Denied ties (contradicted)",ty:"political",w:2,p:[3],cr:false},
  {f:"hc",t:"cf_org",l:"Controls",ty:"professional",w:3,p:[22],cr:false},
  {f:"hc",t:"fake_news",l:"Weaponized the term",ty:"pattern",w:3,p:[13,25],cr:true},
  {f:"hc",t:"silsby",l:"Foundation / reduced charges",ty:"suspicious",w:2,p:[22],cr:true},
  {f:"bp",t:"ncmec",l:"Senior Analyst TS/SCI",ty:"professional",w:3,p:[17],cr:true},
  {f:"tl",t:"ncmec",l:"Network proximity",ty:"professional",w:1,p:[17],cr:false},
  {f:"reines",t:"hc",l:"Senior aide",ty:"professional",w:2,p:[13],cr:false},
  {f:"reines",t:"fake_news",l:"COMETS/pizza tweet",ty:"pattern",w:2,p:[13],cr:false},
  {f:"silsby",t:"cf_org",l:"Haiti / charges reduced",ty:"suspicious",w:3,p:[22],cr:true},
  {f:"km",t:"gm",l:"Married",ty:"family",w:3,p:[],cr:false},
  {f:"km",t:"mm",l:"Mother",ty:"family",w:3,p:[],cr:false},
  {f:"gm",t:"mm",l:"Father",ty:"family",w:3,p:[],cr:false},
  {f:"dp",t:"gm",l:"Close friend (university)",ty:"social",w:3,p:[5],cr:false},
  {f:"dp",t:"fp",l:"Married",ty:"family",w:3,p:[5],cr:false},
  {f:"dp",t:"mm",l:"Organized trip + child access",ty:"suspicious",w:3,p:[5,6],cr:true},
  {f:"km",t:"cf",l:"Befriended July 2007",ty:"social",w:3,p:[9],cr:true},
  {f:"cf",t:"mf",l:"Father → Son",ty:"family",w:3,p:[8],cr:false},
  {f:"mf",t:"cm",l:"Employer",ty:"professional",w:3,p:[8,9],cr:true},
  {f:"cm",t:"km",l:"Spokesperson",ty:"professional",w:3,p:[8,9],cr:false},
  {f:"mi5",t:"sy",l:"Coordinates",ty:"institutional",w:2,p:[30],cr:false},
  {f:"mi5",t:"heath",l:"Blackmail (Livingstone)",ty:"covert",w:3,p:[18],cr:true},
  {f:"mi5",t:"mm",l:"Ex-agents made e-fits",ty:"covert",w:3,p:[30],cr:true},
  {f:"mi5",t:"blackmail_sys",l:"Documented operator",ty:"pattern",w:3,p:[18],cr:true},
  {f:"cia",t:"mi5",l:"Five Eyes",ty:"institutional",w:2,p:[18],cr:false},
  {f:"cia",t:"epstein",l:"Possible asset",ty:"covert",w:2,p:[18],cr:false},
  {f:"cia",t:"blackmail_sys",l:"Vault 7 capability",ty:"pattern",w:3,p:[18],cr:true},
  {f:"kl",t:"mi5",l:"Exposed pedo blackmail (AUDIO)",ty:"adversarial",w:3,p:[18],cr:true},
  {f:"kl",t:"blackmail_sys",l:"Primary witness",ty:"pattern",w:3,p:[18],cr:true},
  {f:"sy",t:"mm",l:"Op Grange £12M+",ty:"institutional",w:2,p:[1,30],cr:false},
  {f:"trump",t:"sessions",l:"Appointed AG",ty:"political",w:2,p:[11],cr:false},
  {f:"stone",t:"flynn",l:"Flynn has pedo list",ty:"communication",w:2,p:[30],cr:false},
  {f:"fbi",t:"ke",l:"Did NOT prosecute",ty:"institutional",w:3,p:[15],cr:true},
  {f:"fbi",t:"coded_lang",l:"Published symbols doc",ty:"institutional",w:2,p:[12],cr:false},
  {f:"amaral",t:"mm",l:"Lead investigator → removed",ty:"institutional",w:3,p:[4,5],cr:false},
  {f:"gaspar",t:"dp",l:"Accused pedophilia (2 events)",ty:"adversarial",w:3,p:[5],cr:true},
  {f:"gaspar",t:"gm",l:"Present during gestures",ty:"witness",w:2,p:[5],cr:false},
  {f:"yvonne",t:"dp",l:"Suspected + formally ID'd",ty:"adversarial",w:3,p:[6],cr:true},
  {f:"yvonne",t:"km",l:"Suspected parents involved",ty:"adversarial",w:2,p:[6],cr:false},
  {f:"hall",t:"mm",l:"14+ hrs documentaries",ty:"investigative",w:2,p:[4,30],cr:false},
  {f:"moran",t:"ke",l:"Exposed via court docs",ty:"adversarial",w:2,p:[17],cr:false},
  {f:"leyland",t:"km",l:"400 critical tweets → dead",ty:"adversarial",w:2,p:[25],cr:true},
  {f:"hyatt",t:"km",l:"Statement analysis: abuse indicators",ty:"investigative",w:2,p:[5],cr:false},
  {f:"cernovich",t:"epstein",l:"Secret papers filed against",ty:"adversarial",w:2,p:[17],cr:false},
  {f:"sawyer",t:"censorship_sys",l:"Crowdfunding blocked",ty:"pattern",w:2,p:[21],cr:true},
  {f:"cf",t:"mm",l:"Villa AT Praia da Luz",ty:"suspicious",w:3,p:[8,9],cr:true},
  {f:"cf_org",t:"un",l:"Both Haiti + trafficking",ty:"pattern",w:2,p:[22],cr:false},
  {f:"rothschild",t:"abramovic",l:"Social/occult events",ty:"social",w:2,p:[27],cr:false},
  {f:"rothschild",t:"jp",l:"Lynn attacked Podesta",ty:"adversarial",w:1,p:[26],cr:false},
  {f:"sf",t:"mm",l:"Saw man carrying child",ty:"witness",w:2,p:[4],cr:false},
  {f:"dp",t:"cf",l:"Both in Praia da Luz",ty:"suspicious",w:2,p:[8],cr:true},
  {f:"seaman",t:"censorship_sys",l:"HuffPost removed / YT censored",ty:"pattern",w:2,p:[12,26],cr:true},
  {f:"frost",t:"censorship_sys",l:"YT channel targeted",ty:"pattern",w:2,p:[20,32],cr:false},
  {f:"jones",t:"bc",l:"'Rapist' - never sued",ty:"adversarial",w:3,p:[16],cr:true},
  {f:"jones",t:"ja",l:"Forced apology",ty:"adversarial",w:3,p:[20],cr:true},
  {f:"jones",t:"psyop",l:"Controlled opposition?",ty:"pattern",w:2,p:[20],cr:false},
  {f:"obrien",t:"silsby",l:"Predicted Haiti patterns",ty:"pattern",w:1,p:[22],cr:false},
  {f:"voat",t:"censorship_sys",l:"Reddit ban / migration",ty:"pattern",w:2,p:[19,32],cr:false},
  {f:"mm_org",t:"censorship_sys",l:"Coordinates attacks",ty:"pattern",w:3,p:[26],cr:true},
  {f:"fake_news",t:"censorship_sys",l:"Justification for censorship",ty:"pattern",w:3,p:[13,26],cr:true},
  {f:"fake_news",t:"media_coverup",l:"Counter-narrative deployed",ty:"pattern",w:3,p:[13,25],cr:true},
  {f:"media_coverup",t:"gaspar",l:"ZERO coverage of sworn testimony",ty:"pattern",w:3,p:[5],cr:true},
  {f:"media_coverup",t:"yvonne",l:"ZERO coverage of 25yr veteran",ty:"pattern",w:3,p:[6],cr:true},
  {f:"media_coverup",t:"ke",l:"Protected from prosecution",ty:"pattern",w:3,p:[15],cr:true},
  {f:"posthumous",t:"cf",l:"Exposed 7 years after death",ty:"pattern",w:3,p:[8],cr:false},
  {f:"posthumous",t:"savile",l:"Exposed after death",ty:"pattern",w:3,p:[14],cr:false},
  {f:"posthumous",t:"heath",l:"Investigated after death",ty:"pattern",w:3,p:[14],cr:false},
  {f:"pedo_norm",t:"ke",l:"NYT documented infrastructure",ty:"pattern",w:2,p:[13,14],cr:false},
  {f:"blackmail_sys",t:"hastert",l:"Speaker was compromised",ty:"pattern",w:3,p:[18],cr:true},
  {f:"blackmail_sys",t:"epstein",l:"Island = recording operation",ty:"pattern",w:3,p:[17,22],cr:true},
  {f:"search_manip",t:"fake_news",l:"Trend manipulation support",ty:"pattern",w:2,p:[24],cr:false},
  {f:"bennett",t:"km",l:"Prison sentence for allegations",ty:"adversarial",w:2,p:[25],cr:true},
  {f:"meme_war",t:"fake_news",l:"Counter-meme deployed",ty:"pattern",w:2,p:[19],cr:false},
  {f:"meme_war",t:"censorship_sys",l:"Physical protest breaks digital censorship",ty:"pattern",w:2,p:[19],cr:false},
  // Part 31 edges
  {f:"weinstein",t:"hc",l:"Longtime donor/friend",ty:"political",w:3,p:[31],cr:true},
  {f:"weinstein",t:"bc",l:"Longtime donor/friend",ty:"political",w:3,p:[31],cr:true},
  {f:"weinstein",t:"obama",l:"Malia intern",ty:"social",w:2,p:[31],cr:false},
  {f:"weinstein",t:"pedowood",l:"Central figure in PedoWood",ty:"pattern",w:3,p:[31],cr:true},
  {f:"weinstein",t:"media_coverup",l:"NYT suppressed 2004 story",ty:"pattern",w:3,p:[31],cr:true},
  {f:"weinstein",t:"posthumous",l:"Protected while useful, then exposed",ty:"pattern",w:2,p:[31],cr:false},
  {f:"waxman",t:"weinstein",l:"2004 exposé suppressed by NYT",ty:"adversarial",w:3,p:[31],cr:true},
  {f:"waxman",t:"media_coverup",l:"Story gutted under pressure",ty:"pattern",w:3,p:[31],cr:true},
  {f:"schneider",t:"pedowood",l:"Nickelodeon access to children",ty:"pattern",w:3,p:[31],cr:true},
  {f:"polanski",t:"pedowood",l:"Convicted rapist — standing ovation",ty:"pattern",w:3,p:[31],cr:true},
  {f:"pedowood",t:"blackmail_sys",l:"Career blackmail = speak up = career over",ty:"pattern",w:2,p:[31],cr:false},
  {f:"pedowood",t:"media_coverup",l:"Decades of institutional silence",ty:"pattern",w:3,p:[31],cr:true},
  {f:"jones",t:"weinstein",l:"Alt media covered before MSM",ty:"investigative",w:1,p:[31],cr:false},
  // ═══ V8: NEW EDGES ═══
  // Justin Berry connections
  {f:"ke",t:"berry",l:"$2,000 check → $300 to minor for CP",ty:"criminal",w:3,p:[15],cr:true},
  {f:"berry",t:"coded_lang",l:"Victim of documented CP infrastructure",ty:"pattern",w:2,p:[13,14],cr:false},
  {f:"berry",t:"media_coverup",l:"NYT published story without disclosing Eichenwald payment",ty:"pattern",w:3,p:[14],cr:true},
  // Suspicious Deaths connections
  {f:"susp_deaths",t:"seth_rich",l:"Murdered — nothing stolen",ty:"pattern",w:3,p:[25],cr:true},
  {f:"susp_deaths",t:"shawn_lucas",l:"Dead after DNC lawsuit service",ty:"pattern",w:2,p:[25],cr:true},
  {f:"susp_deaths",t:"breitbart",l:"Dead after Podesta tweet",ty:"pattern",w:3,p:[20],cr:true},
  {f:"susp_deaths",t:"leyland",l:"Dead after Sky News ambush",ty:"pattern",w:3,p:[25],cr:true},
  {f:"susp_deaths",t:"moran",l:"Dead after Eichenwald exposé",ty:"pattern",w:2,p:[17],cr:true},
  {f:"susp_deaths",t:"whisenant",l:"Dead — Wasserman Schultz district",ty:"pattern",w:1,p:[25],cr:false},
  {f:"susp_deaths",t:"blackmail_sys",l:"Silencing mechanism",ty:"pattern",w:3,p:[25],cr:true},
  {f:"susp_deaths",t:"censorship_sys",l:"Ultimate form of censorship",ty:"pattern",w:2,p:[25],cr:false},
  {f:"seth_rich",t:"wl",l:"Alleged DNC leak source",ty:"suspicious",w:2,p:[25],cr:true},
  {f:"seth_rich",t:"hc",l:"DNC staffer — Clinton campaign",ty:"political",w:1,p:[25],cr:false},
  {f:"shawn_lucas",t:"hc",l:"Served DNC lawsuit papers",ty:"adversarial",w:2,p:[25],cr:true},
  {f:"breitbart",t:"jp",l:"Tweeted about Podesta sex trafficking cover-up",ty:"adversarial",w:3,p:[20],cr:true},
  {f:"breitbart",t:"acorn",l:"Founded BigGovernment.com — premiered ACORN sting",ty:"adversarial",w:2,p:[2],cr:false},
  {f:"breitbart",t:"okeefe",l:"Published Project Veritas ACORN sting",ty:"professional",w:2,p:[2],cr:false},
  // Hollywood enablers
  {f:"damon",t:"weinstein",l:"Called Waxman at Weinstein's request re: Lombardo",ty:"complicity",w:3,p:[31],cr:true},
  {f:"damon",t:"waxman",l:"Called to vouch for Lombardo — story gutted",ty:"adversarial",w:3,p:[31],cr:true},
  {f:"damon",t:"bc",l:"Camp David 1998 screening with Clinton/Weinstein",ty:"social",w:2,p:[31],cr:false},
  {f:"affleck",t:"weinstein",l:"Rose McGowan confronted about knowledge",ty:"complicity",w:3,p:[31],cr:true},
  {f:"affleck",t:"bc",l:"Camp David 1998 with Clinton/Weinstein/Damon",ty:"social",w:2,p:[31],cr:false},
  {f:"affleck",t:"damon",l:"Good Will Hunting / Camp David / suppression",ty:"social",w:2,p:[31],cr:false},
  {f:"lombardo",t:"weinstein",l:"Alleged procurer of women (Miramax Italy)",ty:"criminal",w:3,p:[31],cr:true},
  {f:"lombardo",t:"damon",l:"Damon vouched for Lombardo to Waxman",ty:"complicity",w:3,p:[31],cr:true},
  {f:"walters",t:"feldman",l:"Scolded on-air: 'damaging an entire industry'",ty:"suppression",w:3,p:[31],cr:true},
  {f:"walters",t:"media_coverup",l:"MSM figure suppressing victim testimony",ty:"pattern",w:2,p:[31],cr:true},
  {f:"feldman",t:"pedowood",l:"Decades of abuse testimony — Hollywood's biggest problem",ty:"adversarial",w:3,p:[31],cr:true},
  {f:"kaya",t:"pedowood",l:"Called Pussycat Dolls 'prostitution ring'",ty:"adversarial",w:2,p:[31],cr:true},
  {f:"argento",t:"weinstein",l:"Forcibly performed oral sex — 20 years silent",ty:"victim",w:3,p:[31],cr:true},
  {f:"b_peck",t:"pedowood",l:"Convicted rapist still working with children",ty:"pattern",w:3,p:[31],cr:true},
  {f:"b_peck",t:"schneider",l:"Both Nickelodeon-connected pedophiles",ty:"pattern",w:2,p:[31],cr:false},
  // ACORN / Veritas
  {f:"okeefe",t:"acorn",l:"Undercover sting — 6/7 cities assisted trafficking",ty:"adversarial",w:3,p:[2],cr:true},
  {f:"rathke",t:"acorn",l:"Founder — brother embezzled $1-5M",ty:"professional",w:3,p:[2],cr:false},
  {f:"rathke",t:"obama",l:"Published paper crediting Obama collaboration",ty:"political",w:2,p:[3],cr:true},
  // Comet shooting
  {f:"welch",t:"comet",l:"One round → hit computer hard drive",ty:"suspicious",w:3,p:[20],cr:true},
  {f:"welch",t:"fake_news",l:"Incident weaponized to discredit all research",ty:"pattern",w:3,p:[20],cr:true},
  // Other
  {f:"schwartz",t:"pedowood",l:"De Blasio staffer — 3000+ CP images",ty:"pattern",w:1,p:[25],cr:false},
  {f:"icke",t:"heath",l:"Named as pedophile 1998 — confirmed 2015+",ty:"predictive",w:3,p:[14],cr:true},
  {f:"icke",t:"posthumous",l:"Predictions validated years later",ty:"pattern",w:2,p:[14],cr:false},
  {f:"agnew",t:"jp",l:"Bizarre 2011 tweets — possible planted disinfo",ty:"suspicious",w:1,p:[13],cr:false},
  {f:"agnew",t:"psyop",l:"Possible deliberate disinformation",ty:"pattern",w:2,p:[13],cr:false},
  {f:"maccoby",t:"tl",l:"Referenced in Luzzatto/Podesta emails",ty:"communication",w:2,p:[29],cr:false},
  {f:"brazile",t:"hc",l:"Leaked debate questions to Clinton campaign",ty:"political",w:2,p:[1],cr:false},
  {f:"brazile",t:"wl",l:"Exposed by WikiLeaks → fired from CNN",ty:"adversarial",w:2,p:[1],cr:false},
  {f:"pieczenik",t:"cia",l:"Former Deputy Asst SecState — counter-coup claims",ty:"institutional",w:1,p:[13],cr:false},
];

// ═══ TIMELINE — 60+ events ═══
const TL = [
  {d:"1970",l:"ACORN Founded",desc:"Wade Rathke founds ACORN. Would grow to 500K+ members, receive $53M+ federal funds.",cl:"ORG",p:[2],pg:"pg 3"},
  {d:"1972-12-12",l:"Rothschild Surrealist Ball",desc:"Occult-themed costumes, dismembered dolls, Dalí in attendance at Château de Ferrières.",cl:"OCC",p:[27],pg:"pg 25-32"},
  {d:"1974",l:"Clement Freud becomes Rector of Dundee",desc:"Freud preyed on female students. Kate McCann later attended same university.",cl:"PED",p:[8],pg:"pg 14-16"},
  {d:"1987",l:"Kate Healy begins Dundee Medical School",desc:"Overlapping with Savio Gaspar — friendship would lead to crucial witness statements.",cl:"MCC",p:[5],pg:"pg 3"},
  {d:"1992",l:"Obama runs Project VOTE",desc:"Rathke paper credits ACORN collaboration. Obama would later deny all ties.",cl:"POD",p:[3],pg:"pg 2-5"},
  {d:"1995",l:"Cathy O'Brien publishes 'Trance Formation of America'",desc:"Writes 'Haiti was a prototype of New World Order controls' — 15 years before Clinton Foundation earthquake operations.",cl:"WHI",p:[22],pg:"pg 25-28"},
  {d:"1999",l:"ACORN embezzlement cover-up",desc:"Dale Rathke embezzles ~$1M (possibly $5M). Covered up 8 years.",cl:"ORG",p:[2],pg:"pg 10-11"},
  {d:"2003",l:"Madeleine McCann born",desc:"Born May 12, 2003 in Leicester, England. IVF child.",cl:"MCC",p:[1],pg:"pg 2"},
  {d:"2005-06",l:"Eichenwald accesses child porn 22+ times",desc:"IP traced to Dallas. $2,000 check funded child porn production. PayPal payments under alias 'Andrew McDonald.'",cl:"MED",p:[15],pg:"pg 3-15"},
  {d:"2005-09",l:"Majorca holiday: Gaspar witnesses Payne's gestures",desc:"Dr. Katherina Gaspar witnesses Payne making sexual gestures re: Madeleine on two occasions. Gerry McCann present.",cl:"MCC",p:[5],pg:"pg 3-10"},
  {d:"2005-12-19",l:"NYT publishes Eichenwald's Berry investigation",desc:"'Through His Webcam, a Boy Joins a Sordid Online World' — without disclosing his $2,000 payment or 22+ accesses.",cl:"MED",p:[14],pg:"pg 3-5"},
  {d:"2006-08",l:"NYT pedophile symbols & network investigation",desc:"Eichenwald's two-part series documenting FBI symbols. Same NYT would later dismiss these symbols in 2016.",cl:"MED",p:[12,13],pg:"pg 15-27"},
  {d:"2007-01-31",l:"FBI publishes pedophile symbols document",desc:"BoyLover, GirlLover, ChildLover logos classified. Later central to PizzaGate analysis.",cl:"INT",p:[12],pg:"pg 3-10"},
  {d:"2007-05-03",l:"Madeleine McCann disappears",desc:"Apartment 5A, Ocean Club, Praia da Luz. Kate tells Yvonne Martin daughter was 'taken by a couple.'",cl:"MCC",p:[1],pg:"pg 2-4"},
  {d:"2007-05-04",l:"Cooley emails for Podesta / Martin arrives at scene",desc:"Elizabeth Cooley emails on Podesta's behalf — day after Madeleine disappeared. Yvonne Martin arrives, suspects Payne.",cl:"MCC",p:[1,6],pg:"pg 10-12; pg 3-8"},
  {d:"2007-05-16",l:"Gaspar statements given to UK police",desc:"Both Gaspars provide sworn statements. NOT forwarded to Portuguese for 6+ months.",cl:"WHI",p:[5],pg:"pg 15-18"},
  {d:"2007-06-13",l:"Yvonne Martin formally identifies David Payne",desc:"Identifies Payne from photographs. Writes anonymous letter requesting paedophile register check.",cl:"WHI",p:[6],pg:"pg 8-14"},
  {d:"2007-07",l:"Clement Freud befriends McCanns",desc:"Confirmed pedophile invites McCanns to villa at Praia da Luz. Kate describes him glowingly.",cl:"PED",p:[9],pg:"pg 8-14"},
  {d:"2007-09",l:"McCanns named arguidos — visit Freud first",desc:"FIRST visit that evening: Clement Freud. Jokes about Kate being 'nymphomaniac.' Ridicules cadaver dogs.",cl:"MCC",p:[9],pg:"pg 14-20"},
  {d:"2007-10",l:"Amaral removed / Gaspar statements finally released",desc:"Lead investigator removed. IMMEDIATELY AFTER, Gaspar statements forwarded — 6 months late.",cl:"WHI",p:[4,5],pg:"pg 10-14; pg 16-18"},
  {d:"2008",l:"Ex-MI5 agents produce e-fits",desc:"From witnesses who COULD NOT identify the face. Two different programs. Suppressed 5 more years.",cl:"INT",p:[4,30],pg:"pg 14-16; pg 20-30"},
  {d:"2008-07",l:"Amaral publishes 'Truth of the Lie'",desc:"180,000 copies. Banned/unbanned. Includes Gaspar statements.",cl:"WHI",p:[4,5],pg:"pg 14-18"},
  {d:"2009",l:"Sir Clement Freud dies",desc:"Pedophilia NOT exposed for 7 more years — posthumous pattern.",cl:"PED",p:[8],pg:"pg 16"},
  {d:"2009-09",l:"Project Veritas ACORN exposé",desc:"6 of 7 cities willingly assisted child trafficking scenario. Congress defunds.",cl:"ORG",p:[2],pg:"pg 3-10"},
  {d:"2010-01",l:"Haiti earthquake / Laura Silsby arrested",desc:"Clinton Foundation operating in Haiti. Silsby caught with 33 children. Charges reduced. Later works for Amber Alert under new name.",cl:"ORG",p:[22],pg:"pg 10-25"},
  {d:"2010-11",l:"ACORN shuts down",desc:"Files for Chapter 7 liquidation after losing all federal funding.",cl:"ORG",p:[2],pg:"pg 11"},
  {d:"2013-10-14",l:"E-fits finally shown to public",desc:"BBC Crimewatch — 6+ YEARS after disappearance. No mention e-fits produced by McCann-hired ex-MI5 agents.",cl:"INT",p:[1,4],pg:"pg 12-14; pg 14-16"},
  {d:"2014-10-04",l:"Brenda Leyland found dead",desc:"Helium inhalation at Marriott hotel. Days after Sky News ambush for McCann-critical tweets.",cl:"WHI",p:[25],pg:"pg 30-42"},
  {d:"2016-06-15",l:"Clement Freud exposed as pedophile",desc:"ITV documentary. 3 victims. 7 years after death — posthumous pattern.",cl:"PED",p:[8],pg:"pg 3-16"},
  {d:"2016-10-06",l:"WikiLeaks begins Podesta email releases",desc:"50,000+ emails. Anomalous food-coded language, Spirit Cooking, Luzzatto pool email.",cl:"ORG",p:[1],pg:"pg 3-6"},
  {d:"2016-11",l:"'FAKE NEWS' TERM WEAPONIZED — simultaneous with PizzaGate",desc:"Google Trends show 'fake news' and 'pizzagate' rising simultaneously — not sequentially. Counter-narrative deployed at exact moment investigation emerged. Clinton campaign, Media Matters, MSM adopt in coordination.",cl:"CON",p:[13,24],pg:"pg 28-32; pg 5-15"},
  {d:"2016-11",l:"Spirit Cooking trends → PizzaGate follows",desc:"Spirit Cooking was the initial catalyst driving attention to broader patterns.",cl:"OCC",p:[13,27],pg:"pg 4-12"},
  {d:"2016-11",l:"PizzaGate explodes / Reddit bans r/pizzagate",desc:"Community migrates to voat.co/v/pizzagate. Twitter suspends accounts. Coordinated 'fake news' narrative begins.",cl:"CON",p:[1,19],pg:"pg 8-12"},
  {d:"2016-12-04",l:"Comet shooting + Scotland Yard new lead + Part 1 published",desc:"Welch fires one round (hits computer). MSM uses to discredit research. Meanwhile Scotland Yard announces trafficking lead — NYT/CNN/Guardian don't report it.",cl:"ORG",p:[1,20],pg:"pg 12-14; pg 18-22"},
  {d:"2017-01-03",l:"DHS anti-trafficking ad features pizza establishment",desc:"'Take a Second Look' ad opens with pizza establishment clip.",cl:"INT",p:[11],pg:"pg 10-12"},
  {d:"2017-01-31",l:"McCanns lose Supreme Court vs Amaral",desc:"Portuguese Supreme Court rules in Amaral's favor — validates his right to state professional conclusions.",cl:"WHI",p:[10],pg:"pg 22-24"},
  {d:"2017-02-09",l:"Sessions sworn in + anti-trafficking EO (National Pizza Day)",desc:"Jeff Sessions confirmed. Trump signs Executive Order on trafficking on same day.",cl:"INT",p:[11],pg:"pg 3-10"},
  {d:"2017-02-13",l:"Jeffrey Sandusky arrested (predicted by Seaman source)",desc:"Sandusky's son arrested on child sex abuse charges. David Seaman's source predicted 'high profile arrest.'",cl:"PED",p:[12],pg:"pg 16-18"},
  {d:"2017-02-18",l:"Sir Edward Heath: police say '120% genuine'",desc:"30+ victims. Satanic ritual allegations. Icke had named Heath since 1998 — nearly 20 years before.",cl:"PED",p:[14],pg:"pg 15-28"},
  {d:"2017-02-23",l:"Trump anti-trafficking meeting / Podesta gets WaPo column",desc:"Same day: Trump holds anti-trafficking meeting AND Podesta announced as WaPo columnist.",cl:"POD",p:[15],pg:"pg 5-7"},
  {d:"2017-03-07",l:"WikiLeaks Vault 7 Year Zero",desc:"8,761 CIA documents. Universal hacking, Weeping Angel, UMBRAGE attribution masking, vehicle hacking.",cl:"INT",p:[18],pg:"pg 3-18"},
  {d:"2017-03-08",l:"Part 19: Meme Warfare / Memetics published",desc:"Dedicated analysis of information warfare. Physical protest beats digital censorship.",cl:"CON",p:[19],pg:"pg 15-30"},
  {d:"2017-03-22",l:"David Brock heart attack (predicted by FBI Anon)",desc:"Predicted 16 days earlier. Brock survives.",cl:"POD",p:[20],pg:"pg 30-32"},
  {d:"2017-03-25",l:"PizzaGate protest at Lafayette Park, DC",desc:"Seaman and Frost speak. YouTube censors live streams. 'Pizzagate' temporarily overtakes 'fake news' in trends.",cl:"CON",p:[19,20],pg:"pg 2-8; pg 30-35"},
  {d:"2017-04",l:"Alex Jones apology to Alefantis",desc:"Unprecedented retraction. 'Pizza shop owner' forces largest alt-media to retract while Clinton won't sue for 'rapist.'",cl:"MED",p:[20],pg:"pg 22-28"},
  {d:"2017-04-21",l:"Part 23: Pedophilia Normalization published",desc:"Documents academic/media push to normalize. Ronald Bernard testimony. Salon sympathetic articles.",cl:"CON",p:[23],pg:"pg 5-37"},
  {d:"2017-04-29",l:"Part 24: Google Trends manipulation / ANTIFA-NAMBLA link",desc:"Documents Google Search anomalies. Berkeley ANTIFA group linked to NAMBLA. Comey 'Ramsey rapist.'",cl:"CON",p:[24],pg:"pg 2-23"},
  {d:"2017-06",l:"Eichenwald tentacle porn incident",desc:"Browser tab screenshot. 'Looking up tentacle porn with my kid.' Protected journalist caught again.",cl:"MED",p:[26],pg:"pg 35-40"},
  {d:"2017-07",l:"Luzzatto blog tags discovered",desc:"'Baby Ambien,' 'Tranquilizers,' 'Psychopath' tags on infant content.",cl:"POD",p:[32],pg:"pg 40-55"},
  {d:"2017-10-05",l:"NYT/New Yorker break Weinstein story",desc:"NYT (Jodi Kantor, Megan Twohey) and New Yorker (Ronan Farrow) publish Weinstein exposés. The same NYT that suppressed Sharon Waxman's 2004 story about Weinstein now claims credit for breaking it. Researcher notes the timing and framing are suspicious.",cl:"MED",p:[31],pg:"pg 3-15"},
  {d:"2017-10-06",l:"Part 31: Hollywood Victims / Weinstein / PedoWood",desc:"Researcher publishes Part 31 — 127 pages covering Weinstein saga, NYT suppression, Hollywood victims (Feldman, Schneider, McGowan, Witherspoon, Wood, Crews, Van Der Beek), Dan Schneider, Polanski standing ovation, mind control/eye anomalies, and 'An Open Secret' documentary.",cl:"CON",p:[31],pg:"pg 1-127"},
  {d:"2017-10-10",l:"Rose McGowan confronts Ben Affleck",desc:"McGowan publicly tweets at Affleck that she told him about Weinstein and he did nothing. Affleck, Damon, and Crowe all accused of helping suppress Weinstein coverage.",cl:"CON",p:[31],pg:"pg 95-105"},
  {d:"2017-12",l:"Researcher banned from r/Conspiracy",desc:"Banned for 'spam' after Luzzatto research. Even conspiracy-friendly platforms suppress.",cl:"CON",p:[32],pg:"pg 70-80"},
  {d:"2017-12-30",l:"Part 32 published — final installment",desc:"13-month investigation complete. 32 parts covering McCann, ACORN, FBI symbols, pedophile psychology, Eichenwald, intelligence blackmail, media suppression, occult connections.",cl:"WHI",p:[32],pg:"pg 80-87"},
  // ═══ V8: NEW TIMELINE EVENTS ═══
  {d:"1998",l:"David Icke names Sir Edward Heath as pedophile",desc:"Icke publicly accuses Heath — nearly 20 years before Wiltshire Police confirm '120% genuine' allegations with 30+ victims.",cl:"WHI",p:[14],pg:"MD enrichment"},
  {d:"1998",l:"Camp David: Clinton, Weinstein, Damon, Affleck",desc:"Good Will Hunting screening. Photos later surfaced showing the four together. Clinton Library tweeted archived photo in 2014.",cl:"PED",p:[31],pg:"MD enrichment"},
  {d:"2004",l:"Weinstein suppresses Waxman's NYT exposé",desc:"After Damon and Crowe called Waxman to vouch for procurer Lombardo, NYT story was gutted and buried in Culture section.",cl:"MED",p:[31],pg:"MD enrichment"},
  {d:"2011-02-04",l:"Andrew Breitbart tweets about Podesta",desc:"'How prog-guru John Podesta isn't household name as world class underage sex slave op cover-upper...' — 5 years before PizzaGate.",cl:"DTH",p:[20],pg:"MD enrichment"},
  {d:"2011-08",l:"Corey Feldman: pedophilia is Hollywood's biggest secret",desc:"In interview, stated he and Corey Haim were victims. Barbara Walters scolded him on-air: 'You're damaging an entire industry!'",cl:"WHI",p:[31],pg:"MD enrichment"},
  {d:"2012-03-01",l:"Andrew Breitbart dies unexpectedly (age 43)",desc:"Heart failure. Coroner employee Michael Cormier died of suspected arsenic poisoning on day autopsy results released.",cl:"DTH",p:[20],pg:"MD enrichment"},
  {d:"2016-07-10",l:"Seth Rich murdered — nothing stolen",desc:"DNC staffer shot twice in back at 4:19 AM in DC. Classified as 'botched robbery.' Wallet, phone, keys, watch not taken. $250K OAN reward.",cl:"DTH",p:[25],pg:"MD enrichment"},
  {d:"2016-08-02",l:"Shawn Lucas found dead",desc:"DNC lawsuit process server. Cause: combined effects of fentanyl, cyclobenzaprine, and mitragynine. Less than month after Seth Rich.",cl:"DTH",p:[25],pg:"MD enrichment"},
  {d:"2017-05",l:"Jacob Schwartz arrested for child pornography",desc:"NYC Mayor De Blasio staffer. 3,000+ images, 89 videos, children as young as 6 months. President of Manhattan Young Democrats. Out on $7,500 bail.",cl:"PED",p:[25],pg:"MD enrichment"},
  {d:"2017-05-24",l:"Beranton Whisenant found dead on beach",desc:"Federal prosecutor in visa/passport fraud section. Found in Hollywood, FL — Debbie Wasserman Schultz's district.",cl:"DTH",p:[25],pg:"MD enrichment"},
  {d:"2017-10-10",l:"Rose McGowan confronts Ben Affleck publicly",desc:"Tweets at Affleck that she told him about Weinstein. Affleck, Damon, Crowe all accused of helping suppress coverage.",cl:"CON",p:[31],pg:"MD enrichment"},
];

// ═══ PATHFINDER ═══
function findPaths(from,to,edges,max=4){const ps=[];const v=new Set();function go(c,p){if(p.length>max)return;if(c===to){ps.push([...p]);return;}v.add(c);for(const e of edges){const n=e.f===c?e.t:(e.t===c?e.f:null);if(n&&!v.has(n))go(n,[...p,{e,n}]);}v.delete(c);}go(from,[]);return ps;}

// ═══ COMPONENT ═══
export default function App(){
  const[tab,setTab]=useState("network");
  const[sel,setSel]=useState(null);
  const[hover,setHover]=useState(null);
  const[crit,setCrit]=useState(false);
  const[clFilt,setClFilt]=useState(null);
  const[q,setQ]=useState("");
  const[pFrom,setPFrom]=useState("");
  const[pTo,setPTo]=useState("");
  const[paths,setPaths]=useState([]);
  const[expTL,setExpTL]=useState(null);
  const[expDossier,setExpDossier]=useState(null);
  const[partFilt,setPartFilt]=useState(null);
  const[vb,setVb]=useState({x:-60,y:-30,w:1120,h:680});
  const[dragging,setDragging]=useState(false);
  const[dragStart,setDragStart]=useState(null);
  const svgRef=useRef(null);
  const searchRef=useRef(null);
  // #3 Breadcrumb trail
  const[selHistory,setSelHistory]=useState([]);
  // #6 Edge hover tooltip
  const[edgeHover,setEdgeHover]=useState(null);
  // #2 Touch state
  const[touchState,setTouchState]=useState(null);
  // #15 Force-layout toggle
  const[useForce,setUseForce]=useState(false);
  // #18 Evidence heatmap
  const[showHeatmap,setShowHeatmap]=useState(false);
  // #19 Timeline swimlane mode
  const[swimlane,setSwimlane]=useState(false);

  // #3 Breadcrumb: select with history
  const selectNode=useCallback((id)=>{
    if(id===null){setSel(null);return;}
    if(sel&&sel!==id){setSelHistory(h=>[...h.slice(-19),sel]);}
    setSel(id);
  },[sel]);
  const goBack=useCallback(()=>{
    if(selHistory.length===0)return;
    const prev=selHistory[selHistory.length-1];
    setSelHistory(h=>h.slice(0,-1));
    setSel(prev);
  },[selHistory]);

  // #5 Deep linking: read hash on mount
  useEffect(()=>{
    const h=window.location.hash.slice(1);
    if(!h)return;
    const params=new URLSearchParams(h);
    if(params.get("tab"))setTab(params.get("tab"));
    if(params.get("sel"))setSel(params.get("sel"));
    if(params.get("part"))setPartFilt(+params.get("part"));
  },[]);
  // #5 Deep linking: write hash on change
  useEffect(()=>{
    const params=new URLSearchParams();
    if(tab!=="network")params.set("tab",tab);
    if(sel)params.set("sel",sel);
    if(partFilt!==null)params.set("part",partFilt);
    const h=params.toString();
    window.history.replaceState(null,"",h?`#${h}`:window.location.pathname);
  },[tab,sel,partFilt]);

  // #4 Keyboard navigation
  useEffect(()=>{
    const handler=(e)=>{
      if(e.target.tagName==="INPUT"||e.target.tagName==="SELECT"||e.target.tagName==="TEXTAREA")return;
      if(e.key==="Escape"){setSel(null);setSelHistory([]);setEdgeHover(null);}
      if(e.key==="/"&&tab==="network"){e.preventDefault();searchRef.current?.focus();}
      if(e.key==="Backspace"&&sel){e.preventDefault();goBack();}
      // Arrow keys: cycle through connected nodes
      if(sel&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){
        const connIds=[];
        EDGES.forEach(ed=>{if(ed.f===sel)connIds.push(ed.t);if(ed.t===sel)connIds.push(ed.f);});
        if(connIds.length===0)return;
        const curIdx=connIds.indexOf(sel);
        const nextIdx=e.key==="ArrowRight"?(curIdx+1)%connIds.length:(curIdx-1+connIds.length)%connIds.length;
        selectNode(connIds[nextIdx]);
      }
    };
    window.addEventListener("keydown",handler);
    return()=>window.removeEventListener("keydown",handler);
  },[sel,tab,goBack,selectNode]);

  const nm=useMemo(()=>{const m={};N.forEach(n=>m[n.id]=n);return m;},[]);
  const fEdges=useMemo(()=>{let e=EDGES;if(crit)e=e.filter(x=>x.cr);if(clFilt)e=e.filter(x=>{const a=nm[x.f],b=nm[x.t];return a?.cl===clFilt||b?.cl===clFilt;});if(partFilt!==null)e=e.filter(x=>x.p?.includes(partFilt));return e;},[crit,clFilt,partFilt,nm]);
  const fNodes=useMemo(()=>{let n=N;if(clFilt)n=n.filter(x=>x.cl===clFilt);if(partFilt!==null)n=n.filter(x=>x.p?.includes(partFilt));if(q){const s=q.toLowerCase();n=n.filter(x=>x.l.toLowerCase().includes(s)||x.d.toLowerCase().includes(s)||x.dt.toLowerCase().includes(s)||x.tg.some(t=>t.includes(s)));}return n;},[clFilt,partFilt,q]);
  const conn=useMemo(()=>{if(!sel)return new Set();const s=new Set();EDGES.forEach(e=>{if(e.f===sel)s.add(e.t);if(e.t===sel)s.add(e.f);});return s;},[sel]);
  const stats=useMemo(()=>{const cc={},ec={};N.forEach(n=>{cc[n.cl]=(cc[n.cl]||0)+1;ec[n.ev]=(ec[n.ev]||0)+1;});return{cc,ec,cr:EDGES.filter(e=>e.cr).length};},[]);
  const degreeData=useMemo(()=>N.map(n=>({...n,deg:EDGES.filter(e=>e.f===n.id||e.t===n.id).length})).sort((a,b)=>b.deg-a.deg).slice(0,15),[]);
  const clData=useMemo(()=>Object.entries(CL).map(([k,v])=>({name:v.l,value:stats.cc[k]||0,fill:v.c})),[stats]);
  const evData=useMemo(()=>Object.entries(EV).map(([k,v])=>({name:v.l,value:stats.ec[k]||0,fill:v.c})),[stats]);
  const tlByYear=useMemo(()=>{const m={};TL.forEach(t=>{const y=t.d.substring(0,4);m[y]=(m[y]||0)+1;});return Object.entries(m).map(([y,c])=>({year:y,count:c}));},[]);

  // #14 Google Trends mock data (based on documented Part 13/24 analysis)
  const trendsData=useMemo(()=>[
    {m:"Oct '16",pz:2,fn:1},{m:"Nov 1",pz:15,fn:5},{m:"Nov 15",pz:65,fn:55},{m:"Nov 21",pz:100,fn:80},
    {m:"Dec '16",pz:75,fn:95},{m:"Jan '17",pz:40,fn:100},{m:"Feb",pz:30,fn:85},{m:"Mar",pz:35,fn:70},
    {m:"Apr",pz:20,fn:50},{m:"May",pz:15,fn:40},{m:"Jun",pz:12,fn:35},{m:"Jul",pz:10,fn:30},
    {m:"Aug",pz:8,fn:25},{m:"Sep",pz:7,fn:22},{m:"Oct",pz:15,fn:20},{m:"Nov",pz:8,fn:18},{m:"Dec",pz:10,fn:15},
  ],[]);

  // #15 Simple force-directed layout computation
  const forcePositions=useMemo(()=>{
    if(!useForce)return null;
    const pos={};
    N.forEach(n=>{pos[n.id]={x:n.x+Math.random()*20-10,y:n.y+Math.random()*20-10};});
    for(let iter=0;iter<120;iter++){
      const ids=Object.keys(pos);
      for(let i=0;i<ids.length;i++){
        for(let j=i+1;j<ids.length;j++){
          const a=pos[ids[i]],b=pos[ids[j]];
          let dx=b.x-a.x,dy=b.y-a.y;
          let dist=Math.sqrt(dx*dx+dy*dy)||1;
          if(dist<60){const f=(60-dist)*0.15;const fx=dx/dist*f;const fy=dy/dist*f;a.x-=fx;a.y-=fy;b.x+=fx;b.y+=fy;}
        }
      }
      EDGES.forEach(e=>{
        const a=pos[e.f],b=pos[e.t];
        if(!a||!b)return;
        let dx=b.x-a.x,dy=b.y-a.y;
        let dist=Math.sqrt(dx*dx+dy*dy)||1;
        if(dist>80){const f=(dist-80)*0.02;const fx=dx/dist*f;const fy=dy/dist*f;a.x+=fx;a.y+=fy;b.x-=fx;b.y-=fy;}
      });
      let cx=0,cy=0;ids.forEach(id=>{cx+=pos[id].x;cy+=pos[id].y;});cx/=ids.length;cy/=ids.length;
      ids.forEach(id=>{pos[id].x-=cx-500;pos[id].y-=cy-300;});
    }
    return pos;
  },[useForce]);

  // Helper: get node position (respects force-layout)
  const getPos=useCallback((n)=>{
    if(forcePositions&&forcePositions[n.id])return forcePositions[n.id];
    return{x:n.x,y:n.y};
  },[forcePositions]);

  // Concept-specific stats
  const conceptData=useMemo(()=>{
    const concepts=N.filter(n=>n.cl==="CON");
    return concepts.map(c=>({name:c.l.replace(/ \/ .*/,"").replace(/'/g,""),connections:EDGES.filter(e=>e.f===c.id||e.t===c.id).length,parts:c.p.length})).sort((a,b)=>b.connections-a.connections);
  },[]);

  const suppressionData=useMemo(()=>[
    {method:"Platform Bans",count:5,fill:"#ef4444"},
    {method:"Account Suspend",count:4,fill:"#f97316"},
    {method:"Content Removal",count:6,fill:"#eab308"},
    {method:"Demonetization",count:3,fill:"#22c55e"},
    {method:"Crowdfund Block",count:3,fill:"#3b82f6"},
    {method:"Legal Threats",count:4,fill:"#a855f7"},
    {method:"Deaths/Threats",count:3,fill:"#f43f5e"},
    {method:"MSM Silence",count:10,fill:"#78716c"},
  ],[]);

  const partCoverageData=useMemo(()=>{
    const m={};N.forEach(n=>n.p.forEach(p=>{m[p]=(m[p]||0)+1;}));
    return Object.entries(m).map(([p,c])=>({part:`P${p}`,count:c})).sort((a,b)=>parseInt(a.part.slice(1))-parseInt(b.part.slice(1)));
  },[]);

  // Mouse handlers
  const handleWheel=useCallback((e)=>{e.preventDefault();const f=e.deltaY>0?1.1:0.9;const nw=vb.w*f,nh=vb.h*f;const dx=(nw-vb.w)/2,dy=(nh-vb.h)/2;setVb({x:vb.x-dx,y:vb.y-dy,w:nw,h:nh});},[vb]);
  const handleMouseDown=useCallback((e)=>{if(e.target.tagName==='circle'||e.target.tagName==='text'||e.target.tagName==='rect')return;setDragging(true);setDragStart({x:e.clientX,y:e.clientY,vb:{...vb}});},[vb]);
  const handleMouseMove=useCallback((e)=>{if(!dragging||!dragStart)return;const svg=svgRef.current;if(!svg)return;const rect=svg.getBoundingClientRect();const sx=vb.w/rect.width,sy=vb.h/rect.height;setVb({...dragStart.vb,x:dragStart.vb.x-(e.clientX-dragStart.x)*sx,y:dragStart.vb.y-(e.clientY-dragStart.y)*sy,w:dragStart.vb.w,h:dragStart.vb.h});},[dragging,dragStart,vb]);
  const handleMouseUp=useCallback(()=>{
    if(dragging)didDrag.current=true;
    setDragging(false);setDragStart(null);
  },[dragging]);

  // #2 Touch handlers for mobile
  const handleTouchStart=useCallback((e)=>{
    if(e.touches.length===1){
      setTouchState({type:"pan",x:e.touches[0].clientX,y:e.touches[0].clientY,vb:{...vb}});
    } else if(e.touches.length===2){
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      const dist=Math.sqrt(dx*dx+dy*dy);
      setTouchState({type:"pinch",dist,vb:{...vb}});
    }
  },[vb]);
  const handleTouchMove=useCallback((e)=>{
    e.preventDefault();
    if(!touchState)return;
    if(touchState.type==="pan"&&e.touches.length===1){
      const svg=svgRef.current;if(!svg)return;
      const rect=svg.getBoundingClientRect();
      const sx=touchState.vb.w/rect.width,sy=touchState.vb.h/rect.height;
      setVb({...touchState.vb,x:touchState.vb.x-(e.touches[0].clientX-touchState.x)*sx,y:touchState.vb.y-(e.touches[0].clientY-touchState.y)*sy,w:touchState.vb.w,h:touchState.vb.h});
    } else if(touchState.type==="pinch"&&e.touches.length===2){
      const dx=e.touches[0].clientX-e.touches[1].clientX;
      const dy=e.touches[0].clientY-e.touches[1].clientY;
      const dist=Math.sqrt(dx*dx+dy*dy);
      const scale=touchState.dist/dist;
      const nw=touchState.vb.w*scale,nh=touchState.vb.h*scale;
      const ddx=(nw-touchState.vb.w)/2,ddy=(nh-touchState.vb.h)/2;
      setVb({x:touchState.vb.x-ddx,y:touchState.vb.y-ddy,w:nw,h:nh});
    }
  },[touchState]);
  const handleTouchEnd=useCallback(()=>{setTouchState(null);},[]);

  // #1 Background click on SVG (for non-drag clicks)
  const didDrag=useRef(false);
  const handleSvgClick=useCallback((e)=>{
    // If we dragged, don't deselect
    if(didDrag.current){didDrag.current=false;return;}
    // If click target is not a node element, deselect
    const tag=e.target.tagName;
    if(tag!=='circle'&&tag!=='text'&&(tag!=='rect'||e.target.dataset?.bg==='1')){
      setSel(null);setSelHistory([]);
    }
  },[]);

  const Btn=({id,lb})=>(<button onClick={()=>setTab(id)} style={{padding:"7px 14px",background:tab===id?T.red+"12":"transparent",color:tab===id?T.hi:T.dim,border:"none",borderBottom:tab===id?`2px solid ${T.red}`:"2px solid transparent",cursor:"pointer",fontFamily:T.font,fontSize:9,letterSpacing:2,whiteSpace:"nowrap",transition:"all .15s"}}>{lb}</button>);

  // #7 Active filters bar (shown in all tabs)
  const activeFilters=clFilt||partFilt!==null||q;
  const FilterBar=()=>activeFilters?(<div style={{padding:"4px 14px",background:T.bg3+"88",borderBottom:`1px solid ${T.bdr}`,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
    <span style={{fontSize:7,color:T.dim,letterSpacing:1}}>ACTIVE FILTERS:</span>
    {clFilt&&<span onClick={()=>setClFilt(null)} style={{fontSize:7,padding:"1px 6px",background:CL[clFilt].c+"22",border:`1px solid ${CL[clFilt].c}44`,borderRadius:2,color:CL[clFilt].c,cursor:"pointer"}}>✕ {CL[clFilt].l}</span>}
    {partFilt!==null&&<span onClick={()=>setPartFilt(null)} style={{fontSize:7,padding:"1px 6px",background:T.red+"22",border:`1px solid ${T.red}44`,borderRadius:2,color:T.red,cursor:"pointer"}}>✕ Part {partFilt}</span>}
    {q&&<span onClick={()=>setQ("")} style={{fontSize:7,padding:"1px 6px",background:T.bg4,border:`1px solid ${T.bdr}`,borderRadius:2,color:T.hi,cursor:"pointer"}}>✕ "{q}"</span>}
    <span onClick={()=>{setClFilt(null);setPartFilt(null);setQ("");}} style={{fontSize:7,color:T.dim,cursor:"pointer",textDecoration:"underline",marginLeft:4}}>Clear all</span>
  </div>):null;

  return(
  <div style={{fontFamily:T.font,background:T.bg,color:T.text,minHeight:"100vh"}}>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}`}</style>
    {/* HEADER */}
    <div style={{background:`linear-gradient(180deg,#0a0004 0%,${T.bg} 100%)`,borderBottom:`1px solid ${T.red}22`,padding:"6px 14px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
        <div style={{minWidth:200}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:7,color:T.red,letterSpacing:4,opacity:.6,fontWeight:700}}>■ CLASSIFIED</span>
            <span style={{width:1,height:10,background:T.bdr,display:"inline-block"}}/>
            <span style={{fontSize:7,color:T.dim,letterSpacing:3}}>SI // ORCON // NOFORN</span>
          </div>
          <div style={{fontSize:13,fontWeight:700,color:T.hi,marginTop:2,letterSpacing:.5}}>NETWORK INTELLIGENCE PLATFORM <span style={{color:T.red,fontWeight:400,fontSize:10}}>v8.0</span></div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
          <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{background:T.red+"18",color:T.red,padding:"4px 10px",fontSize:8,fontFamily:T.font,borderRadius:2,textDecoration:"none",letterSpacing:1.5,border:`1px solid ${T.red}33`,fontWeight:700}}>
            ⬇ SOURCE PDFs
          </a>
          <input ref={searchRef} placeholder="/ search" value={q} onChange={e=>setQ(e.target.value)} style={{background:T.bg3,border:`1px solid ${T.bdr}`,color:T.hi,padding:"4px 8px",fontSize:9,fontFamily:T.font,borderRadius:2,width:120}} />
          <select value={partFilt??""} onChange={e=>setPartFilt(e.target.value?+e.target.value:null)} style={{background:T.bg3,border:`1px solid ${T.bdr}`,color:T.hi,padding:"4px",fontSize:8,fontFamily:T.font,borderRadius:2}}>
            <option value="">ALL PARTS</option>
            {Array.from({length:32},(_,i)=><option key={i} value={i+1}>PT {i+1}</option>)}
          </select>
        </div>
      </div>
    </div>
    {/* STATUS BAR */}
    <div style={{display:"flex",gap:0,borderBottom:`1px solid ${T.bdr}`,background:T.bg2,fontSize:8,letterSpacing:1}}>
      <div style={{display:"flex",gap:0,flex:1,overflow:"hidden"}}>
        {[{l:"NODES",v:N.length,c:T.acc},{l:"EDGES",v:EDGES.length,c:"#8b5cf6"},{l:"CRITICAL",v:stats.cr,c:T.red},{l:"EVENTS",v:TL.length,c:T.gold},{l:"CLUSTERS",v:Object.keys(CL).length,c:"#22c55e"},{l:"PARTS",v:32,c:"#6366f1"}].map((s,i)=>(
          <div key={i} style={{padding:"4px 10px",borderRight:`1px solid ${T.bdr}`,display:"flex",alignItems:"center",gap:4}}>
            <span style={{color:s.c,fontWeight:700}}>{s.v}</span><span style={{color:T.dim}}>{s.l}</span>
          </div>
        ))}
      </div>
      <div style={{padding:"4px 10px",color:T.dim,display:"flex",alignItems:"center",gap:4}}>
        <span style={{width:5,height:5,borderRadius:"50%",background:T.red,display:"inline-block",animation:"pulse 2s infinite"}}/>LIVE
      </div>
    </div>
    {/* TABS */}
    <div style={{display:"flex",borderBottom:`1px solid ${T.bdr}`,background:T.bg,overflowX:"auto"}}>
      <Btn id="network" lb="NETWORK" /><Btn id="timeline" lb="TIMELINE" /><Btn id="concepts" lb="CONCEPTS" /><Btn id="pathfinder" lb="PATHFINDER" /><Btn id="dossier" lb="DOSSIERS" /><Btn id="witnesses" lb="WITNESSES" /><Btn id="intel" lb="INTEL" /><Btn id="parts" lb="PARTS" /><Btn id="stats" lb="STATS" /><Btn id="matrix" lb="MATRIX" />
    </div>
    {/* #7 Sticky active filters bar */}
    <FilterBar/>

    {/* ═══ NETWORK ═══ */}
    {tab==="network"&&(
    <div style={{display:"flex",height:activeFilters?"calc(100vh - 142px)":"calc(100vh - 118px)"}}>
      <div style={{flex:1,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:4,left:4,zIndex:10,display:"flex",gap:3,flexWrap:"wrap",maxWidth:"70%"}}>
          <span onClick={()=>setClFilt(null)} style={{fontSize:7,padding:"2px 5px",background:!clFilt?T.red+"33":T.bg3,border:`1px solid ${!clFilt?T.red:T.bdr}`,borderRadius:2,cursor:"pointer",color:T.hi}}>ALL</span>
          {Object.entries(CL).map(([k,v])=>(<span key={k} onClick={()=>setClFilt(clFilt===k?null:k)} style={{fontSize:7,padding:"2px 5px",background:clFilt===k?v.c+"33":T.bg3,border:`1px solid ${clFilt===k?v.c:T.bdr}`,borderRadius:2,cursor:"pointer",color:v.c}}>{v.l}</span>))}
        </div>
        <div style={{position:"absolute",top:4,right:4,zIndex:10,display:"flex",gap:6,alignItems:"center"}}>
          <label style={{fontSize:8,cursor:"pointer",color:T.red,display:"flex",alignItems:"center",gap:3}}>
            <input type="checkbox" checked={crit} onChange={e=>setCrit(e.target.checked)} style={{accentColor:T.red}} /> CRITICAL
          </label>
          <label style={{fontSize:8,cursor:"pointer",color:"#3b82f6",display:"flex",alignItems:"center",gap:3}}>
            <input type="checkbox" checked={useForce} onChange={e=>setUseForce(e.target.checked)} style={{accentColor:"#3b82f6"}} /> FORCE
          </label>
          <label style={{fontSize:8,cursor:"pointer",color:"#a855f7",display:"flex",alignItems:"center",gap:3}}>
            <input type="checkbox" checked={showHeatmap} onChange={e=>setShowHeatmap(e.target.checked)} style={{accentColor:"#a855f7"}} /> HEATMAP
          </label>
          <button onClick={()=>{setVb({x:-60,y:-30,w:1120,h:680});setUseForce(false);}} style={{fontSize:7,padding:"2px 6px",background:T.bg3,border:`1px solid ${T.bdr}`,borderRadius:2,cursor:"pointer",color:T.dim,fontFamily:T.font}}>RESET VIEW</button>
        </div>
        {/* #6 Edge hover tooltip */}
        {edgeHover&&(<div style={{position:"absolute",zIndex:20,left:edgeHover.cx,top:edgeHover.cy,transform:"translate(-50%,-100%)",pointerEvents:"none",background:T.bg3,border:`1px solid ${edgeHover.cr?T.red:T.bdr}`,borderRadius:3,padding:"4px 8px",maxWidth:200}}>
          <div style={{fontSize:8,color:T.hi,fontWeight:700}}>{edgeHover.l}</div>
          <div style={{fontSize:7,color:T.dim,marginTop:2}}>{nm[edgeHover.f]?.l} ↔ {nm[edgeHover.t]?.l}</div>
          <div style={{fontSize:7,color:T.dim}}>Type: {edgeHover.ty} · Parts: {edgeHover.p?.join(",")}{edgeHover.cr?" · ⚠ CRITICAL":""}</div>
        </div>)}
        {/* #16 Edge type legend */}
        <div style={{position:"absolute",bottom:4,left:4,zIndex:10,background:T.bg2+"dd",border:`1px solid ${T.bdr}`,borderRadius:3,padding:"4px 8px",display:"flex",gap:8,flexWrap:"wrap"}}>
          {[{ty:"solid",l:"Family/Prof",d:""},{ty:"covert",l:"Covert",d:"6,3"},{ty:"suspicious",l:"Suspicious",d:""},{ty:"adversarial",l:"Adversarial",d:"2,4"},{ty:"communication",l:"Comms",d:"3,3"},{ty:"pattern",l:"Pattern",d:"4,2"}].map(lt=>(
            <span key={lt.l} style={{display:"flex",alignItems:"center",gap:3,fontSize:6,color:T.dim}}>
              <svg width={20} height={6}><line x1={0} y1={3} x2={20} y2={3} stroke={lt.ty==="suspicious"?T.red:T.text} strokeWidth={1.2} strokeDasharray={lt.d}/></svg>{lt.l}
            </span>
          ))}
        </div>
        <svg ref={svgRef} viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} style={{width:"100%",height:"100%",cursor:dragging?"grabbing":"grab",touchAction:"none"}}
          onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={()=>{setDragging(false);setDragStart(null);setEdgeHover(null);}}
          onClick={handleSvgClick}
          onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <defs>{Object.entries(CL).map(([k,v])=>(<radialGradient key={k} id={`g${k}`}><stop offset="0%" stopColor={v.c} stopOpacity=".35"/><stop offset="100%" stopColor={v.c} stopOpacity=".08"/></radialGradient>))}</defs>
          {/* #1 Invisible background rect for click-to-deselect */}
          <rect data-bg="1" x={vb.x-5000} y={vb.y-5000} width={vb.w+10000} height={vb.h+10000} fill="transparent"/>
          {/* #6 Edge hover: invisible wider hit area + visible line */}
          {fEdges.map((e,i)=>{const a=nm[e.f],b=nm[e.t];if(!a||!b)return null;const pa=getPos(a),pb=getPos(b);const hl=sel&&(e.f===sel||e.t===sel);const op=sel?(hl?.85:.04):(e.cr?.55:.15);
          return(<g key={i}
            onMouseEnter={(ev)=>{const svg=svgRef.current;if(!svg)return;const rect=svg.getBoundingClientRect();setEdgeHover({...e,cx:(ev.clientX-rect.left),cy:(ev.clientY-rect.top)-10});}}
            onMouseLeave={()=>setEdgeHover(null)}>
            <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="transparent" strokeWidth={12} style={{cursor:"help"}}/>
            <line x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={e.cr?T.red:CL[a.cl]?.c||"#555"} strokeWidth={e.cr?2.5:e.w>2?1.3:.7} strokeDasharray={e.ty==="covert"?"6,3":e.ty==="suspicious"?"":e.ty==="adversarial"?"2,4":e.ty==="communication"?"3,3":e.ty==="pattern"?"4,2":""} opacity={op} style={{pointerEvents:"none"}}/>
            {hl&&<text x={(pa.x+pb.x)/2} y={(pa.y+pb.y)/2-5} fontSize={Math.max(6,7-vb.w/300)} fill={T.hi} textAnchor="middle" opacity={.9}>{e.l}</text>}
          </g>);})}
          {(clFilt||q||partFilt!==null?fNodes:N).map(n=>{const c=CL[n.cl];const iS=sel===n.id;const iC=conn.has(n.id);const op=sel?(iS||iC?1:.08):1;const r=(n.sz||14)/2;const ev=EV[n.ev];const isConcept=n.cl==="CON";const p=getPos(n);return(<g key={n.id} onClick={(e)=>{e.stopPropagation();selectNode(iS?null:n.id);}} onMouseEnter={()=>setHover(n.id)} onMouseLeave={()=>setHover(null)} style={{cursor:"pointer"}} opacity={op}>
            {/* #18 Evidence heatmap glow */}
            {showHeatmap&&<circle cx={p.x} cy={p.y} r={r+18} fill={ev?.c||"#666"} opacity={.12}/>}
            {iS&&<circle cx={p.x} cy={p.y} r={r+7} fill="none" stroke={T.red} strokeWidth={1.5} strokeDasharray="3,2"><animate attributeName="r" values={`${r+5};${r+9};${r+5}`} dur="2s" repeatCount="indefinite"/></circle>}
            {isConcept?<rect x={p.x-r} y={p.y-r} width={r*2} height={r*2} rx={3} fill={`url(#g${n.cl})`} stroke={c.c} strokeWidth={iS?2.5:hover===n.id?2:1} strokeDasharray="4,2"/>:<circle cx={p.x} cy={p.y} r={r} fill={`url(#g${n.cl})`} stroke={c.c} strokeWidth={iS?2.5:hover===n.id?2:1}/>}
            <circle cx={p.x+r*.7} cy={p.y-r*.7} r={2.5} fill={ev?.c||"#666"} stroke={T.bg} strokeWidth={.5}/>
            <text x={p.x} y={p.y+r+9} fontSize={Math.max(6,iS?8:7)} fill={iS?T.hi:T.text} textAnchor="middle" fontWeight={iS?700:400}>{n.l}</text>
          </g>);})}
        </svg>
        {/* #17 Mini-map */}
        {(vb.w<900||vb.x>50||vb.y>50)&&(<div style={{position:"absolute",bottom:28,right:4,zIndex:15,background:T.bg2+"ee",border:`1px solid ${T.bdr}`,borderRadius:3,padding:2}}>
          <svg width={120} height={72} viewBox="-60 -30 1120 680" style={{display:"block"}}>
            {EDGES.filter(e=>e.cr).map((e,i)=>{const a=nm[e.f],b=nm[e.t];if(!a||!b)return null;const pa=getPos(a),pb=getPos(b);return(<line key={i} x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke={T.red} strokeWidth={4} opacity={.3}/>);})}
            {N.map(n=>{const c=CL[n.cl];const p=getPos(n);return(<circle key={n.id} cx={p.x} cy={p.y} r={3} fill={c?.c||"#555"} opacity={sel===n.id?1:.5}/>);})}
            <rect x={vb.x} y={vb.y} width={vb.w} height={vb.h} fill="none" stroke={T.hi} strokeWidth={8} opacity={.5} rx={4}/>
          </svg>
        </div>)}
      </div>
      {/* DETAIL */}
      <div style={{width:300,borderLeft:`1px solid ${T.bdr}`,padding:10,overflowY:"auto",background:T.bg2,fontSize:9}}>
        {sel?(()=>{const n=nm[sel];const c=CL[n.cl];const ev=EV[n.ev];const ed=EDGES.filter(e=>e.f===n.id||e.t===n.id);
        return(<div>
          {/* #3 Breadcrumb back button */}
          {selHistory.length>0&&(<div onClick={goBack} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer",marginBottom:6,padding:"3px 6px",background:T.bg3,borderRadius:2,border:`1px solid ${T.bdr}`}}>
            <span style={{color:T.dim,fontSize:10}}>←</span>
            <span style={{color:T.dim,fontSize:8}}>Back to {nm[selHistory[selHistory.length-1]]?.l||"previous"}</span>
          </div>)}
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div style={{color:c.c,fontSize:12,fontWeight:700}}>{n.l}</div>
            <span style={{fontSize:7,padding:"2px 5px",background:ev.c+"22",border:`1px solid ${ev.c}44`,borderRadius:2,color:ev.c}}>{n.ev}</span>
          </div>
          <div style={{color:T.dim,fontSize:8,marginTop:1}}>{c.l}</div>
          <div style={{color:T.hi,marginTop:6,lineHeight:1.5,fontSize:10}}>{n.d}</div>
          <div style={{fontSize:8,color:T.red,marginTop:4,padding:"3px 6px",background:T.red+"11",borderRadius:2,display:"inline-block"}}>📄 Parts: {n.p.join(", ")}</div>
          <div style={{color:T.text,marginTop:8,lineHeight:1.6,borderTop:`1px solid ${T.bdr}`,paddingTop:6,whiteSpace:"pre-line"}}>{n.dt}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:6}}>{n.tg.map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",background:T.bg3,border:`1px solid ${T.bdr}`,borderRadius:2,color:T.dim}}>#{t}</span>)}</div>
          <div style={{marginTop:8,color:T.dim,fontSize:8,borderTop:`1px solid ${T.bdr}`,paddingTop:4}}>CONNECTIONS ({ed.length}) — use ← → arrows to navigate:</div>
          {ed.map((e,i)=>{const oid=e.f===n.id?e.t:e.f;const o=nm[oid];if(!o)return null;const oc=CL[o.cl];
          return(<div key={i} onClick={()=>selectNode(oid)} style={{padding:"3px 0",borderBottom:`1px solid ${T.bg}`,cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
            <span style={{width:5,height:5,borderRadius:o.cl==="CON"?1:"50%",background:oc.c,flexShrink:0}}/>
            <span style={{color:T.hi,fontSize:9}}>{o.l}</span>
            <span style={{color:T.dim,fontSize:7,marginLeft:"auto"}}>{e.l}</span>
            {e.cr&&<span style={{color:T.red,fontSize:7}}>⚠</span>}
          </div>);})}
        </div>);})():(<div style={{color:T.dim,textAlign:"center",marginTop:50}} onClick={()=>{setSel(null);setSelHistory([]);}}>
          <div style={{fontSize:24,opacity:.2,marginBottom:6}}>⊙</div>
          <div style={{fontSize:10}}>Click a node to inspect</div>
          <div style={{fontSize:8,marginTop:3}}>Click background or press Esc to deselect</div>
          <div style={{fontSize:8,marginTop:3}}>Scroll/pinch to zoom · Drag to pan</div>
          <div style={{fontSize:8,marginTop:3}}>◼ = Concept node · ● = Entity node</div>
          {/* #4 Keyboard shortcuts */}
          <div style={{textAlign:"left",marginTop:12,fontSize:8}}>
            <div style={{color:T.hi,marginBottom:4}}>KEYBOARD SHORTCUTS:</div>
            <div style={{color:T.dim,marginTop:2}}><span style={{color:T.hi}}>/</span> — Focus search</div>
            <div style={{color:T.dim,marginTop:2}}><span style={{color:T.hi}}>Esc</span> — Deselect node</div>
            <div style={{color:T.dim,marginTop:2}}><span style={{color:T.hi}}>← →</span> — Navigate connections</div>
            <div style={{color:T.dim,marginTop:2}}><span style={{color:T.hi}}>Backspace</span> — Go back</div>
          </div>
          <div style={{textAlign:"left",marginTop:12,fontSize:8}}>
            <div style={{color:T.hi,marginBottom:4}}>EVIDENCE LEVELS:</div>
            {Object.entries(EV).map(([k,v])=>(<div key={k} style={{display:"flex",alignItems:"center",gap:5,marginTop:3}}><span style={{width:7,height:7,borderRadius:"50%",background:v.c}}/><span>{v.l}</span><span style={{color:T.dim,marginLeft:4,fontSize:7}}>— {v.d}</span></div>))}
          </div>
          <div style={{textAlign:"left",marginTop:12}}>
            <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{color:T.red,fontSize:8}}>⬇ Download All 32 Parts (PDF)</a>
          </div>
        </div>)}
      </div>
    </div>)}

    {/* ═══ TIMELINE ═══ */}
    {tab==="timeline"&&(
    <div style={{padding:16,maxWidth:swimlane?1200:920,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto",overflowX:swimlane?"auto":"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,color:T.red,letterSpacing:2}}>CHRONOLOGICAL EVENT TIMELINE — {TL.length} EVENTS</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <label style={{fontSize:8,cursor:"pointer",color:"#3b82f6",display:"flex",alignItems:"center",gap:3}}>
            <input type="checkbox" checked={swimlane} onChange={e=>setSwimlane(e.target.checked)} style={{accentColor:"#3b82f6"}} /> SWIMLANES
          </label>
          <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{color:T.red,fontSize:8,textDecoration:"none"}}>⬇ PDF Source Files</a>
        </div>
      </div>

      {/* #19 Swimlane view */}
      {swimlane?(()=>{
        const lanes=Object.entries(CL).filter(([k])=>TL.some(t=>t.cl===k));
        const years=[...new Set(TL.map(t=>t.d.substring(0,4)))].sort();
        return(<div>
          <div style={{fontSize:8,color:T.dim,marginBottom:8}}>Events organized by cluster. Each row is an independent track showing parallel developments across domains.</div>
          <div style={{display:"grid",gridTemplateColumns:`80px repeat(${years.length}, minmax(60px,1fr))`,gap:0,border:`1px solid ${T.bdr}`,borderRadius:3,overflow:"hidden"}}>
            {/* Header row */}
            <div style={{padding:4,background:T.bg3,borderBottom:`1px solid ${T.bdr}`,borderRight:`1px solid ${T.bdr}`,fontSize:7,color:T.dim}}>CLUSTER</div>
            {years.map(y=>(<div key={y} style={{padding:4,background:T.bg3,borderBottom:`1px solid ${T.bdr}`,borderRight:`1px solid ${T.bdr}`,fontSize:7,color:T.hi,textAlign:"center"}}>{y}</div>))}
            {/* Lane rows */}
            {lanes.map(([k,v])=>{
              const laneEvents=TL.filter(t=>t.cl===k);
              return(<div key={k+"row"} style={{display:"contents"}}>
                <div key={k+"label"} style={{padding:"4px 6px",background:T.bg2,borderBottom:`1px solid ${T.bdr}`,borderRight:`1px solid ${T.bdr}`,display:"flex",alignItems:"center",gap:3}}>
                  <span style={{width:6,height:6,borderRadius:1,background:v.c,flexShrink:0}}/>
                  <span style={{fontSize:7,color:v.c,fontWeight:700}}>{v.l.split("/")[0].trim()}</span>
                </div>
                {years.map(y=>{
                  const yEvents=laneEvents.filter(t=>t.d.substring(0,4)===y);
                  return(<div key={k+y} style={{padding:3,background:T.bg,borderBottom:`1px solid ${T.bdr}`,borderRight:`1px solid ${T.bdr}`,minHeight:24}}>
                    {yEvents.map((t,ti)=>(<div key={ti} onClick={()=>setExpTL(TL.indexOf(t)===expTL?null:TL.indexOf(t))} style={{fontSize:6,color:v.c,padding:"1px 2px",background:expTL===TL.indexOf(t)?v.c+"22":"transparent",borderRadius:1,cursor:"pointer",marginBottom:1,lineHeight:1.3,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={t.l}>
                      {t.l.substring(0,25)}{t.l.length>25?"…":""}
                    </div>))}
                  </div>);
                })}
              </div>);
            })}
          </div>
          {/* Expanded event detail */}
          {expTL!==null&&TL[expTL]&&(<div style={{marginTop:8,padding:"8px 10px",background:T.bg2,border:`1px solid ${CL[TL[expTL].cl]?.c||T.bdr}44`,borderRadius:3}}>
            <div style={{fontSize:9,color:CL[TL[expTL].cl]?.c,fontWeight:700}}>{TL[expTL].d} — {TL[expTL].l}</div>
            <div style={{fontSize:9,color:T.text,marginTop:4,lineHeight:1.7}}>{TL[expTL].desc}</div>
            <div style={{fontSize:7,color:T.dim,marginTop:3}}>Parts: {TL[expTL].p.join(", ")} · {TL[expTL].pg}</div>
          </div>)}
        </div>);
      })():(
      /* Standard vertical timeline */
      <div style={{position:"relative",paddingLeft:28}}>
        <div style={{position:"absolute",left:10,top:0,bottom:0,width:2,background:T.bdr}}/>
        {TL.map((t,i)=>{const c=CL[t.cl];const exp=expTL===i;
        return(<div key={i} onClick={()=>setExpTL(exp?null:i)} style={{marginBottom:6,cursor:"pointer",position:"relative"}}>
          <div style={{position:"absolute",left:-22,top:6,width:8,height:8,borderRadius:"50%",background:c?.c||T.dim,border:`2px solid ${T.bg}`,zIndex:1}}/>
          <div style={{padding:"6px 10px",background:exp?T.bg3:T.bg2,border:`1px solid ${exp?c?.c+"55":T.bdr}`,borderRadius:3,transition:"all .15s"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:8}}>
              <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}>
                <span style={{fontSize:8,color:c?.c||T.dim,fontWeight:700,flexShrink:0,width:70}}>{t.d}</span>
                <span style={{fontSize:9,color:T.hi,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:exp?"normal":"nowrap"}}>{t.l}</span>
              </div>
              <div style={{display:"flex",gap:4,flexShrink:0}}>
                {t.pg&&<span style={{fontSize:7,color:T.dim,background:T.bg3,padding:"1px 3px",borderRadius:2}}>{t.pg}</span>}
                <span style={{fontSize:7,color:T.dim}}>P:{t.p.join(",")}</span>
              </div>
            </div>
            {exp&&(<div style={{marginTop:6,fontSize:9,color:T.text,lineHeight:1.7,borderTop:`1px solid ${T.bdr}`,paddingTop:6}}>{t.desc}</div>)}
          </div>
        </div>);})}
      </div>
      )}
    </div>)}

    {/* ═══ CONCEPTS ═══ */}
    {tab==="concepts"&&(
    <div style={{padding:16,maxWidth:1000,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,color:"#f59e0b",letterSpacing:2}}>SYSTEMIC CONCEPTS & PATTERNS</div>
        <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{color:T.red,fontSize:8,textDecoration:"none"}}>⬇ PDF Source Files</a>
      </div>
      <div style={{fontSize:9,color:T.dim,marginBottom:12,lineHeight:1.6}}>
        Beyond individuals, the investigation identified recurring systemic patterns that operate across all cases. These concepts connect the dots between otherwise isolated incidents into a coherent system of institutional abuse, protection, and suppression.
      </div>
      {/* Concept connection chart */}
      <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10,marginBottom:12}}>
        <div style={{fontSize:9,color:T.hi,marginBottom:6}}>CONCEPT CONNECTIVITY — CONNECTIONS PER PATTERN</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={conceptData} layout="vertical" margin={{left:10}}>
            <XAxis type="number" tick={{fontSize:8,fill:T.dim}} stroke={T.bdr}/>
            <YAxis type="category" dataKey="name" tick={{fontSize:7,fill:T.text}} width={160} stroke={T.bdr}/>
            <Bar dataKey="connections" radius={[0,3,3,0]} fill="#f59e0b" opacity={.7}/>
            <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Suppression methods chart */}
      <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10,marginBottom:12}}>
        <div style={{fontSize:9,color:T.hi,marginBottom:6}}>DOCUMENTED SUPPRESSION METHODS</div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={suppressionData}>
            <XAxis dataKey="method" tick={{fontSize:7,fill:T.dim,angle:-30,textAnchor:"end"}} stroke={T.bdr} height={60}/>
            <YAxis tick={{fontSize:8,fill:T.dim}} stroke={T.bdr}/>
            <Bar dataKey="count" radius={[3,3,0,0]}>{suppressionData.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
            <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* #14 Google Trends: "Fake News" vs "PizzaGate" */}
      <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10,marginBottom:12}}>
        <div style={{fontSize:9,color:T.hi,marginBottom:2}}>GOOGLE SEARCH TRENDS — "FAKE NEWS" vs "PIZZAGATE" (Oct 2016 – Dec 2017)</div>
        <div style={{fontSize:7,color:T.dim,marginBottom:6}}>Based on documented analysis in Parts 13 and 24. Both terms rise simultaneously — the counter-narrative was deployed at the exact moment the investigation emerged.</div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={trendsData} margin={{left:0,right:10}}>
            <XAxis dataKey="m" tick={{fontSize:7,fill:T.dim}} stroke={T.bdr}/>
            <YAxis tick={{fontSize:7,fill:T.dim}} stroke={T.bdr} domain={[0,100]}/>
            <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
            <Line type="monotone" dataKey="pz" name="PizzaGate" stroke={T.red} strokeWidth={2} dot={{r:2,fill:T.red}} activeDot={{r:4}}/>
            <Line type="monotone" dataKey="fn" name="Fake News" stroke="#eab308" strokeWidth={2} dot={{r:2,fill:"#eab308"}} activeDot={{r:4}} strokeDasharray="5,3"/>
            <Legend wrapperStyle={{fontSize:8,fontFamily:T.font}} iconSize={8}/>
          </LineChart>
        </ResponsiveContainer>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:7,color:T.dim,marginTop:4}}>
          <span>⚠ Nov 2016: Both terms spike simultaneously, not sequentially</span>
          <span>Dec '16: "Fake News" overtakes as counter-narrative succeeds</span>
        </div>
      </div>
      {/* Concept cards */}
      {N.filter(n=>n.cl==="CON").map(n=>{const ev=EV[n.ev];const ed=EDGES.filter(e=>e.f===n.id||e.t===n.id);const exp=expDossier===n.id;
      return(<div key={n.id} style={{marginBottom:8,border:`1px solid ${exp?"#f59e0b44":T.bdr}`,borderRadius:3,overflow:"hidden"}}>
        <div onClick={()=>setExpDossier(exp?null:n.id)} style={{padding:"8px 10px",background:T.bg2,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{width:8,height:8,borderRadius:2,background:"#f59e0b",flexShrink:0}}/>
            <span style={{color:"#f59e0b",fontWeight:700,fontSize:11}}>{n.l}</span>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
            <span style={{fontSize:7,color:T.dim}}>{ed.length} links</span>
            <span style={{fontSize:7,color:T.dim}}>Parts: {n.p.join(",")}</span>
            <span style={{fontSize:7,padding:"1px 4px",background:ev.c+"22",border:`1px solid ${ev.c}33`,borderRadius:2,color:ev.c}}>{n.ev}</span>
            <span style={{color:T.dim,fontSize:10}}>{exp?"▾":"▸"}</span>
          </div>
        </div>
        {exp&&(<div style={{padding:"8px 10px",borderTop:`1px solid ${T.bdr}`}}>
          <div style={{fontSize:9,color:T.hi,lineHeight:1.5,marginBottom:4}}>{n.d}</div>
          <div style={{fontSize:9,color:T.text,lineHeight:1.7,whiteSpace:"pre-line",borderTop:`1px solid ${T.bdr}`,paddingTop:6}}>{n.dt}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:6}}>{n.tg.map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",background:T.bg3,border:`1px solid ${T.bdr}`,borderRadius:2,color:T.dim}}>#{t}</span>)}</div>
          <div style={{marginTop:6,fontSize:8,color:T.dim,borderTop:`1px solid ${T.bdr}`,paddingTop:4}}>Connected entities: {ed.map(e=>{const o=nm[e.f===n.id?e.t:e.f];return o?.l;}).filter(Boolean).join(", ")}</div>
        </div>)}
      </div>);})}
    </div>)}

    {/* ═══ PATHFINDER ═══ */}
    {tab==="pathfinder"&&(
    <div style={{padding:16,maxWidth:920,margin:"0 auto"}}>
      <div style={{fontSize:12,color:T.red,letterSpacing:2,marginBottom:12}}>CONNECTION PATH FINDER</div>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:12,flexWrap:"wrap"}}>
        <select value={pFrom} onChange={e=>setPFrom(e.target.value)} style={{background:T.bg3,border:`1px solid ${T.bdr}`,color:T.hi,padding:"6px",fontSize:9,fontFamily:T.font,borderRadius:3,flex:1,minWidth:120}}>
          <option value="">FROM...</option>{N.sort((a,b)=>a.l.localeCompare(b.l)).map(n=><option key={n.id} value={n.id}>{n.l} [{CL[n.cl]?.l}]</option>)}
        </select>
        <span style={{color:T.red,fontSize:14}}>→</span>
        <select value={pTo} onChange={e=>setPTo(e.target.value)} style={{background:T.bg3,border:`1px solid ${T.bdr}`,color:T.hi,padding:"6px",fontSize:9,fontFamily:T.font,borderRadius:3,flex:1,minWidth:120}}>
          <option value="">TO...</option>{N.sort((a,b)=>a.l.localeCompare(b.l)).map(n=><option key={n.id} value={n.id}>{n.l} [{CL[n.cl]?.l}]</option>)}
        </select>
        <button onClick={()=>{if(pFrom&&pTo&&pFrom!==pTo)setPaths(findPaths(pFrom,pTo,EDGES));}} style={{background:T.red,color:"#fff",border:"none",padding:"6px 14px",fontSize:9,fontFamily:T.font,borderRadius:3,cursor:"pointer"}}>TRACE</button>
      </div>
      {paths.length>0?paths.map((p,pi)=>(<div key={pi} style={{marginBottom:10,padding:8,background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3}}>
        <div style={{fontSize:8,color:T.red,marginBottom:4}}>PATH {pi+1} · {p.length} hops</div>
        <div style={{display:"flex",alignItems:"center",gap:3,flexWrap:"wrap"}}>
          <span style={{fontSize:9,color:CL[nm[pFrom]?.cl]?.c,fontWeight:700}}>{nm[pFrom]?.l}</span>
          {p.map((s,si)=>(<span key={si} style={{display:"flex",alignItems:"center",gap:3}}>
            <span style={{fontSize:7,color:T.dim}}>—[{s.e.l}]→</span>
            <span style={{fontSize:9,color:CL[nm[s.n]?.cl]?.c,fontWeight:700}}>{nm[s.n]?.l}</span>
            {s.e.cr&&<span style={{color:T.red,fontSize:7}}>⚠</span>}
          </span>))}
        </div>
      </div>)):(<div style={{color:T.dim,textAlign:"center",marginTop:30,fontSize:10}}>Select two nodes and click TRACE. Concepts can be traced too!</div>)}
    </div>)}

    {/* ═══ DOSSIERS ═══ */}
    {tab==="dossier"&&(
    <div style={{padding:16,maxWidth:1000,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:12,color:T.red,letterSpacing:2}}>NODE DOSSIERS — {N.length} INTELLIGENCE PROFILES</div>
        <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{color:T.red,fontSize:8,textDecoration:"none"}}>⬇ PDF Source Files</a>
      </div>
      <div style={{display:"flex",gap:3,flexWrap:"wrap",marginBottom:10}}>
        <span onClick={()=>setClFilt(null)} style={{fontSize:7,padding:"2px 5px",background:!clFilt?T.red+"33":T.bg3,border:`1px solid ${!clFilt?T.red:T.bdr}`,borderRadius:2,cursor:"pointer",color:T.hi}}>ALL ({N.length})</span>
        {Object.entries(CL).map(([k,v])=>(<span key={k} onClick={()=>setClFilt(clFilt===k?null:k)} style={{fontSize:7,padding:"2px 5px",background:clFilt===k?v.c+"33":T.bg3,border:`1px solid ${clFilt===k?v.c:T.bdr}`,borderRadius:2,cursor:"pointer",color:v.c}}>{v.l} ({stats.cc[k]||0})</span>))}
      </div>
      {(clFilt?N.filter(n=>n.cl===clFilt):N).map(n=>{const c=CL[n.cl];const ev=EV[n.ev];const ed=EDGES.filter(e=>e.f===n.id||e.t===n.id);const exp=expDossier===n.id;
      return(<div key={n.id} style={{marginBottom:6,border:`1px solid ${exp?c.c+"44":T.bdr}`,borderRadius:3,overflow:"hidden"}}>
        <div onClick={()=>setExpDossier(exp?null:n.id)} style={{padding:"6px 10px",background:T.bg2,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",gap:6,minWidth:0}}>
            <span style={{width:6,height:6,borderRadius:n.cl==="CON"?2:"50%",background:c.c,flexShrink:0}}/>
            <span style={{color:c.c,fontWeight:700,fontSize:10}}>{n.l}</span>
            <span style={{color:T.dim,fontSize:8,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{n.d}</span>
          </div>
          <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
            <span style={{fontSize:7,color:T.dim}}>{ed.length} links</span>
            <span style={{fontSize:7,color:T.dim}}>P:{n.p.join(",")}</span>
            <span style={{fontSize:7,padding:"1px 4px",background:ev.c+"22",border:`1px solid ${ev.c}33`,borderRadius:2,color:ev.c}}>{n.ev}</span>
            <span style={{color:T.dim,fontSize:10}}>{exp?"▾":"▸"}</span>
          </div>
        </div>
        {exp&&(<div style={{padding:"8px 10px",borderTop:`1px solid ${T.bdr}`}}>
          <div style={{fontSize:9,color:T.text,lineHeight:1.7,whiteSpace:"pre-line"}}>{n.dt}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:6}}>{n.tg.map(t=><span key={t} style={{fontSize:7,padding:"1px 4px",background:T.bg3,border:`1px solid ${T.bdr}`,borderRadius:2,color:T.dim}}>#{t}</span>)}</div>
          <div style={{fontSize:8,color:T.dim,marginTop:4}}>Parts: {n.p.join(", ")} · Connections: {ed.map(e=>{const o=nm[e.f===n.id?e.t:e.f];return o?.l;}).filter(Boolean).join(", ")}</div>
        </div>)}
      </div>);})}
    </div>)}

    {/* ═══ WITNESSES ═══ */}
    {tab==="witnesses"&&(
    <div style={{padding:16,maxWidth:1000,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,color:"#06b6d4",letterSpacing:2}}>WITNESS CREDIBILITY MATRIX — {WITNESSES.length} KEY WITNESSES</div>
        <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{color:T.red,fontSize:8,textDecoration:"none"}}>⬇ PDF Source Files</a>
      </div>
      <div style={{fontSize:9,color:T.dim,marginBottom:12,lineHeight:1.6}}>
        Independent assessment of key witnesses by credentials, independence from involved parties, corroboration with other evidence, and potential motives.
      </div>
      {WITNESSES.map((w,i)=>{const ev=EV[w.ev];return(<div key={i} style={{marginBottom:8,border:`1px solid ${T.bdr}`,borderRadius:3,padding:"10px 12px",background:T.bg2}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
          <div style={{color:T.hi,fontSize:11,fontWeight:700}}>{w.name}</div>
          <span style={{fontSize:7,padding:"2px 5px",background:ev.c+"22",border:`1px solid ${ev.c}44`,borderRadius:2,color:ev.c,flexShrink:0}}>{w.ev}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"90px 1fr",gap:"4px 8px",fontSize:9}}>
          <span style={{color:"#06b6d4",fontWeight:700}}>Credentials:</span><span style={{color:T.text}}>{w.credentials}</span>
          <span style={{color:"#22c55e",fontWeight:700}}>Independence:</span><span style={{color:T.text}}>{w.independence}</span>
          <span style={{color:"#eab308",fontWeight:700}}>Corroboration:</span><span style={{color:T.text}}>{w.corroboration}</span>
          <span style={{color:"#f97316",fontWeight:700}}>Motive:</span><span style={{color:T.text}}>{w.motive}</span>
        </div>
        <div style={{fontSize:7,color:T.dim,marginTop:4}}>Parts: {w.p.join(", ")} · {w.pg}</div>
      </div>);})}
    </div>)}

    {/* ═══ MONEY & GEO ═══ */}
    {tab==="intel"&&(
    <div style={{padding:16,maxWidth:1000,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      {/* Financial flows */}
      <div style={{fontSize:12,color:T.red,letterSpacing:2,marginBottom:12}}>FINANCIAL FLOWS — DOCUMENTED MONEY TRAIL</div>
      <div style={{fontSize:9,color:T.dim,marginBottom:10,lineHeight:1.6}}>
        Key financial transactions documented across the investigation, ranging from alleged blackmail payments to federal funding of compromised organizations.
      </div>
      <div style={{display:"grid",gap:6,marginBottom:24}}>
        {FINANCES.map((f,i)=>{const ev=EV[f.ev];return(<div key={i} style={{padding:"8px 10px",background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <span style={{color:T.hi,fontSize:10,fontWeight:700}}>{f.from}</span>
              <span style={{color:T.red,fontSize:12}}>→</span>
              <span style={{color:T.hi,fontSize:10,fontWeight:700}}>{f.to}</span>
            </div>
            <div style={{display:"flex",gap:4,alignItems:"center"}}>
              <span style={{color:"#22c55e",fontSize:11,fontWeight:700}}>{f.amount}</span>
              <span style={{fontSize:7,padding:"1px 4px",background:ev.c+"22",border:`1px solid ${ev.c}33`,borderRadius:2,color:ev.c}}>{f.ev}</span>
            </div>
          </div>
          <div style={{fontSize:8,color:"#f59e0b"}}>{f.type}</div>
          <div style={{fontSize:9,color:T.text,marginTop:3,lineHeight:1.5}}>{f.desc}</div>
          <div style={{fontSize:7,color:T.dim,marginTop:2}}>Parts: {f.p.join(", ")} · {f.pg}</div>
        </div>);})}
      </div>

      {/* Geographic data */}
      <div style={{fontSize:12,color:"#3b82f6",letterSpacing:2,marginBottom:12}}>GEOGRAPHIC DISTRIBUTION — {GEO.length} KEY LOCATIONS</div>
      <div style={{fontSize:9,color:T.dim,marginBottom:10,lineHeight:1.6}}>
        The network spans multiple countries: USA (DC, NY, LA, Dallas, California), UK (London, Belfast), Portugal (Praia da Luz, Portimão), France, Scotland, and Haiti — revealing an international system.
      </div>
      <div style={{display:"grid",gap:6}}>
        {GEO.map((g,i)=>(<div key={i} style={{padding:"8px 10px",background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
            <span style={{color:"#3b82f6",fontSize:10,fontWeight:700}}>{g.loc}</span>
            <span style={{fontSize:7,color:T.dim}}>📍 {g.lat.toFixed(2)}, {g.lon.toFixed(2)}</span>
          </div>
          <div style={{fontSize:9,color:T.text,lineHeight:1.5}}>{g.desc}</div>
          <div style={{display:"flex",gap:3,flexWrap:"wrap",marginTop:4}}>
            {g.nodes.map(nid=>{const nd=nm[nid];if(!nd)return null;return(<span key={nid} onClick={()=>{selectNode(nid);setTab("network");}} style={{fontSize:7,padding:"1px 4px",background:CL[nd.cl]?.c+"22",border:`1px solid ${CL[nd.cl]?.c}33`,borderRadius:2,color:CL[nd.cl]?.c,cursor:"pointer"}}>{nd.l}</span>);})}
          </div>
          <div style={{fontSize:7,color:T.dim,marginTop:2}}>Parts: {g.p.join(", ")}</div>
        </div>))}
      </div>
    </div>)}

    {/* ═══ PARTS INDEX ═══ */}
    {tab==="parts"&&(
    <div style={{padding:16,maxWidth:1000,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:12,color:T.red,letterSpacing:2}}>COMPLETE PARTS INDEX — 32 REPORTS</div>
        <a href={DRIVE_URL} target="_blank" rel="noopener noreferrer" style={{background:`linear-gradient(135deg,${T.red},#b91c1c)`,color:"#fff",padding:"5px 10px",fontSize:9,fontFamily:T.font,borderRadius:3,textDecoration:"none",letterSpacing:1,border:"1px solid #dc2626"}}>
          ⬇ DOWNLOAD ALL 32 PARTS
        </a>
      </div>
      <div style={{fontSize:9,color:T.dim,marginBottom:12}}>
        Each part is a PDF document in the Proton Drive archive. Click the download button above to access all 32 parts.
      </div>
      <div style={{display:"grid",gap:4}}>
        {Object.entries(PARTS_INDEX).map(([num,info])=>{
          const nodeCount=N.filter(n=>n.p.includes(+num)).length;
          const edgeCount=EDGES.filter(e=>e.p.includes(+num)).length;
          return(<div key={num} onClick={()=>{setPartFilt(+num);setTab("network");}} style={{padding:"6px 10px",background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{color:T.red,fontWeight:700,fontSize:11,width:50}}>Part {num}</span>
              <span style={{color:T.hi,fontSize:9}}>{info.t}</span>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:7,color:T.dim}}>{info.d}</span>
              {info.pg>0&&<span style={{fontSize:7,color:T.dim}}>{info.pg} pg</span>}
              <span style={{fontSize:7,color:T.dim}}>{nodeCount}N / {edgeCount}E</span>
            </div>
          </div>);
        })}
      </div>
    </div>)}

    {/* ═══ STATISTICS ═══ */}
    {tab==="stats"&&(
    <div style={{padding:16,maxWidth:1000,margin:"0 auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      <div style={{fontSize:12,color:T.red,letterSpacing:2,marginBottom:12}}>NETWORK STATISTICS & INTELLIGENCE METRICS</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(90px,1fr))",gap:8,marginBottom:16}}>
        {[{l:"NODES",v:N.length},{l:"EDGES",v:EDGES.length},{l:"CRITICAL",v:stats.cr},{l:"EVENTS",v:TL.length},{l:"REPORTS",v:32},{l:"CLUSTERS",v:Object.keys(CL).length},{l:"CONCEPTS",v:N.filter(n=>n.cl==="CON").length},{l:"PEOPLE",v:N.filter(n=>n.cl!=="CON"&&n.cl!=="ORG").length}].map((s,i)=>(
          <div key={i} style={{padding:10,background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:700,color:T.hi}}>{s.v}</div>
            <div style={{fontSize:7,color:T.dim,letterSpacing:1,marginTop:1}}>{s.l}</div>
          </div>))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10}}>
          <div style={{fontSize:9,color:T.hi,marginBottom:6}}>CLUSTER DISTRIBUTION</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={clData} cx="50%" cy="50%" outerRadius={70} innerRadius={35} dataKey="value" label={({name,percent})=>`${(percent*100).toFixed(0)}%`} labelLine={false} fontSize={8}>
              {clData.map((d,i)=><Cell key={i} fill={d.fill} stroke={T.bg} strokeWidth={2}/>)}
            </Pie><Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/></PieChart>
          </ResponsiveContainer>
          <div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:4}}>{clData.map(d=><span key={d.name} style={{fontSize:7,display:"flex",alignItems:"center",gap:3}}><span style={{width:6,height:6,background:d.fill,borderRadius:1}}/>{d.name}: {d.value}</span>)}</div>
        </div>
        <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10}}>
          <div style={{fontSize:9,color:T.hi,marginBottom:6}}>EVIDENCE CONFIDENCE</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={evData} layout="vertical">
              <XAxis type="number" tick={{fontSize:8,fill:T.dim}} stroke={T.bdr}/>
              <YAxis type="category" dataKey="name" tick={{fontSize:8,fill:T.text}} width={80} stroke={T.bdr}/>
              <Bar dataKey="value" radius={[0,3,3,0]}>{evData.map((d,i)=><Cell key={i} fill={d.fill}/>)}</Bar>
              <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      {/* Degree centrality */}
      <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10,marginBottom:16}}>
        <div style={{fontSize:9,color:T.hi,marginBottom:6}}>DEGREE CENTRALITY — TOP 15 MOST CONNECTED NODES</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={degreeData} layout="vertical" margin={{left:10}}>
            <XAxis type="number" tick={{fontSize:8,fill:T.dim}} stroke={T.bdr}/>
            <YAxis type="category" dataKey="l" tick={{fontSize:8,fill:T.text}} width={160} stroke={T.bdr}/>
            <Bar dataKey="deg" radius={[0,3,3,0]}>{degreeData.map((d,i)=><Cell key={i} fill={CL[d.cl]?.c||"#555"}/>)}</Bar>
            <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Part coverage */}
      <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10,marginBottom:16}}>
        <div style={{fontSize:9,color:T.hi,marginBottom:6}}>NODE COVERAGE PER PART — HOW MANY NODES REFERENCE EACH PART</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={partCoverageData}>
            <XAxis dataKey="part" tick={{fontSize:6,fill:T.dim}} stroke={T.bdr}/>
            <YAxis tick={{fontSize:8,fill:T.dim}} stroke={T.bdr}/>
            <Bar dataKey="count" fill="#3b82f6" radius={[3,3,0,0]} opacity={.7}/>
            <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {/* Timeline density */}
      <div style={{background:T.bg2,border:`1px solid ${T.bdr}`,borderRadius:3,padding:10}}>
        <div style={{fontSize:9,color:T.hi,marginBottom:6}}>TIMELINE EVENT DENSITY BY YEAR</div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={tlByYear}>
            <XAxis dataKey="year" tick={{fontSize:7,fill:T.dim}} stroke={T.bdr}/>
            <YAxis tick={{fontSize:8,fill:T.dim}} stroke={T.bdr}/>
            <Bar dataKey="count" fill={T.red} radius={[3,3,0,0]} opacity={.7}/>
            <Tooltip contentStyle={{background:T.bg3,border:`1px solid ${T.bdr}`,fontSize:9,fontFamily:T.font}} itemStyle={{color:T.hi}}/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>)}

    {/* ═══ MATRIX ═══ */}
    {tab==="matrix"&&(
    <div style={{padding:16,overflowX:"auto",maxHeight:"calc(100vh - 118px)",overflowY:"auto"}}>
      <div style={{fontSize:12,color:T.red,letterSpacing:2,marginBottom:12}}>ADJACENCY MATRIX — CRITICAL LINKS</div>
      {(()=>{const ce=EDGES.filter(e=>e.cr);const ids=new Set();ce.forEach(e=>{ids.add(e.f);ids.add(e.t);});const cn=N.filter(n=>ids.has(n.id)).sort((a,b)=>a.l.localeCompare(b.l));const em={};ce.forEach(e=>{em[`${e.f}_${e.t}`]=e;em[`${e.t}_${e.f}`]=e;});
      return(<table style={{borderCollapse:"collapse",fontSize:7}}><thead><tr><th style={{padding:2,background:T.bg2,position:"sticky",left:0,zIndex:2}}/>{cn.map(n=><th key={n.id} style={{padding:2,background:T.bg2,color:CL[n.cl]?.c,writingMode:"vertical-lr",transform:"rotate(180deg)",maxWidth:16,textAlign:"left"}}>{n.l}</th>)}</tr></thead>
      <tbody>{cn.map(r=><tr key={r.id}><td style={{padding:"1px 4px",background:T.bg2,color:CL[r.cl]?.c,fontWeight:700,position:"sticky",left:0,zIndex:1,whiteSpace:"nowrap"}}>{r.l}</td>
        {cn.map(c=>{const e=em[`${r.id}_${c.id}`];return<td key={c.id} title={e?.l||""} style={{width:14,height:14,padding:0,border:`1px solid ${T.bg}`,background:r.id===c.id?T.bg3:e?T.red+"44":"transparent",cursor:e?"help":"default"}}>{e&&<div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",color:T.red,fontSize:7}}>⚠</div>}</td>;})}</tr>)}</tbody></table>);})()}
    </div>)}
  </div>);
}