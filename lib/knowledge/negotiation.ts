// ============================================================================
// Knowledge Base: Negotiation & Interview Intelligence
// Salary negotiation frameworks and tech interview preparation tactics
// ============================================================================

export const NEGOTIATION_KNOWLEDGE = `=== SALARY NEGOTIATION INTELLIGENCE ===

CORE PRINCIPLES:
1. Never name a number first. When asked "What are your salary expectations?", respond with: "I'd like to learn more about the role and its scope before discussing compensation. What's the range you have budgeted for this position?"
2. If pressed, give a range where your target is the bottom: "Based on my research for this role in [market], I'd expect something in the range of €X-Y." (where X = your target)
3. Base salary compounds over your career. Every €5K higher in base compounds for decades. Fight harder for base than for one-time bonuses.
4. Total comp includes: base salary, bonus (percentage of base), equity/stock options, sign-on bonus, benefits (healthcare, pension, learning budget), remote work flexibility, vacation days.
5. The best time to negotiate is AFTER they've decided to hire you but BEFORE you've accepted. This is when your leverage is highest.

NEGOTIATION TACTICS BY SCENARIO:

REMOTE WORKERS IN LOW-COST COUNTRIES:
- Anchor to the VALUE you deliver, not your local cost of living
- "I understand the market rate for this role in your region is €X-Y. Given my [specific experience], I'd expect to be in the [mid-upper] range."
- Companies hiring remote explicitly are already willing to pay above local rates
- If they lowball based on your location: "I appreciate that, but I'm comparing opportunities across EU-wide remote positions. My other conversations are in the €X range."
- Research the company's HQ location salaries and expect 70-90% of that for remote

CAREER CHANGERS:
- Acknowledge the pivot honestly but anchor on transferable value
- "While this would be my first [target role] title, I bring [X years] of [transferable experience] that directly applies. My [specific project/cert] demonstrates I can deliver in this domain."
- Accept 10-20% below market if the role has high growth potential, but negotiate a 6-month performance review with salary adjustment clause
- Non-salary levers: title, learning budget, conference attendance, equity, remote flexibility

COUNTER-OFFER FRAMEWORK:
1. Thank them enthusiastically (they want to hire you — this is good)
2. Express genuine interest in the role
3. State your counter clearly: "I'm very excited about this opportunity. Based on my research and the value I'd bring with [specific differentiator], I was hoping for €X. Is there flexibility?"
4. If they can't move on base: ask for sign-on bonus, earlier review cycle, higher equity, or additional benefits
5. Never give an ultimatum unless you're truly willing to walk away

RED FLAGS IN OFFERS:
- No equity in a startup (means they don't value you as a long-term bet)
- Below-market base with "but the bonus potential is huge" (bonuses are uncertain)
- Significantly below your current salary with "but there's lots of growth" (growth isn't guaranteed)
- Pressure to accept within 24-48 hours (legitimate companies give you a week)
- Verbal offer without written confirmation (always get it in writing)

=== TECH INTERVIEW PREPARATION ===

SOLUTIONS ARCHITECT INTERVIEWS:
1. System Design (60% of interviews)
   - Practice designing: URL shortener, chat system, news feed, payment system, notification service
   - Framework: Requirements → High-level design → Component deep-dive → Scaling → Trade-offs
   - Key: show you understand trade-offs, not just the "right" answer
   - Tools: Excalidraw, draw.io for whiteboard sessions

2. Behavioral (30%)
   - STAR format: Situation, Task, Action, Result
   - Prepare stories for: conflict resolution, technical disagreement, project failure, leading without authority
   - SA-specific: "Tell me about a time you had to convince a customer to change their architecture"

3. Technical depth (10%)
   - Deep dive on one topic from your experience
   - Know your own CV deeply — they WILL ask about anything listed
   - Prepare to go 3 levels deep on any technology you list

AI/ML ENGINEER INTERVIEWS:
1. ML Theory (30%): bias-variance, overfitting, model selection, evaluation metrics
2. Coding (30%): Python, data manipulation, algorithm implementation
3. System Design (20%): ML pipeline design, data architecture, model serving
4. ML Case Study (20%): "How would you build a model to predict X?" — show full lifecycle thinking

SOFTWARE ENGINEER INTERVIEWS:
1. Data Structures & Algorithms (40%): LeetCode medium difficulty, focus on arrays, trees, graphs, dynamic programming
2. System Design (30%): Start preparing at 3+ years experience
3. Behavioral (20%): STAR format, company values alignment
4. Coding Project (10%): Some companies do take-home projects instead of live coding

INTERVIEW TIPS FOR CAREER CHANGERS:
- Proactively address the pivot: "You might wonder why I'm moving from [X] to [Y]. Here's why..."
- Frame everything as additive: "My [old domain] experience means I bring [unique perspective] that most [target role] candidates don't have"
- Prepare 2-3 stories that bridge both domains
- Show passion for the new domain: reference recent projects, courses, community involvement
- Ask about onboarding and ramp-up support (shows self-awareness without signaling weakness)
`;

/**
 * Get negotiation context based on career situation
 */
export function getNegotiationContext(
  country: string,
  workPreference: string,
  currentRole: string,
  targetRole: string
): string {
  const isRemote = workPreference === 'remote' || workPreference === 'flexible';
  const isCareerChange = currentRole.toLowerCase() !== targetRole.toLowerCase();

  let context = NEGOTIATION_KNOWLEDGE;

  if (isRemote) {
    context += `\nSPECIFIC TO THIS CANDIDATE (Remote from ${country}):
- Anchor salary expectations to EU/EMEA remote market, NOT local ${country} rates
- Companies hiring remotely in ${country} are already expecting to pay above local market
- The "location discount" is typically 10-30% off HQ salary, NOT the full local rate
- Negotiate in the employer's currency (usually EUR or USD) to avoid exchange rate complexity
- Remote work itself has value — factor in commute savings, flexibility premium\n`;
  }

  if (isCareerChange) {
    context += `\nSPECIFIC TO THIS CANDIDATE (Career Change: ${currentRole} → ${targetRole}):
- Expect initial offers 10-20% below market for the target role due to the transition
- This is normal and acceptable IF the role has clear growth trajectory
- Negotiate a 6-month review with explicit salary adjustment criteria
- Non-monetary compensation (title, learning budget, mentorship) may matter more initially
- After 12-18 months in the new role, market rates fully apply for your next move\n`;
  }

  return context;
}
