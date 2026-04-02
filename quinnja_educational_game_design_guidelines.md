# Quinnja Educational Game Design Guidelines

## Instructions for AI Assistants

Use this document as a guiding standard when reviewing, designing, or coding children's educational games such as Quinnja Letters. Treat these rules as default priorities unless explicitly told otherwise.

This is a child-first project. Every recommendation should prioritise learning, clarity, emotional safety, confidence, accessibility for pre-readers, and low-friction usability. Do not optimise for addictive engagement, monetisation patterns, or flashy features unless they clearly support the child's learning experience.

Prefer small, safe, high-confidence improvements over broad rewrites. When suggesting features or fixes, explain the educational reason behind them, not just the technical implementation. When in doubt, simplify.

---

## Core Principles

### 1. Child benefit comes first
Any feature that mainly serves engagement metrics, retention tricks, artificial reward loops, or visual spectacle should be treated with suspicion. Prefer features that genuinely improve comprehension, confidence, memory, focus, independence, or smooth transitions between activities.

### 2. Learning should be direct, not buried
Do not hide the educational goal behind long intros, clutter, confusing mechanics, or unnecessary story layers. The learning interaction itself should feel satisfying. If the child is learning letters, sounds, tracing, matching, or blending, get them into that activity quickly.

### 3. Reduce cognitive load
Young children have limited working memory and attention. Keep screens simple. Show only the most important controls and cues. Avoid dense layouts, tiny icons, multiple competing animations, and too many simultaneous instructions.

### 4. Prioritise emotional safety and predictability
Use familiar characters, consistent layouts, repeated patterns, and gentle feedback. Children learn better when the interface feels stable and safe. Do not introduce unpredictable navigation, harsh sounds, shame-based failure states, or sudden visual overload.

### 5. Design for pre-readers and emerging readers
Assume the child may not be able to read instructions fluently. Use visuals, motion, audio prompts, examples, and obvious affordances. Important interactions should be understandable without relying on text alone.

### 6. Immediate feedback matters
Children benefit from fast, clear, meaningful feedback. When they act, the app should respond right away. Feedback should explain success, error, or next step in a simple way. Avoid vague or delayed responses.

### 7. Scaffolding beats punishment
When the child struggles, do not just mark them wrong. Gradually increase support: simplify the task, highlight the target, replay the sound, reduce distractors, offer a model answer, or break the task into smaller parts.

### 8. Difficulty should adapt gently
Where possible, adjust challenge based on performance. If the child is succeeding easily, increase variation or difficulty slightly. If they are struggling, slow down, repeat, simplify, or give more guidance. Avoid abrupt jumps in challenge.

### 9. Minimalism is a strength
A small, polished mechanic that teaches one concept well is better than a large, messy system with many weak mini-games. Prefer focused, high-quality interactions over feature sprawl.

### 10. The app should support agency, not chaos
Children should feel in control, but not lost. Choices should be limited, clear, and age-appropriate. Avoid menus that feel like adult software. Make the next good action obvious.

---

## Design Inspirations to Lean TOWard

- Use trusted companion characters to create familiarity, warmth, and continuity.
- Use visual logic and visual structure to make complex ideas feel graspable.
- Use very focused game loops that teach one skill clearly and efficiently.
- Use visual teaching methods that work even without text.
- Use mission, theme, or story lightly to support motivation, but never let theme overpower clarity.

---

## UI and UX Rules

- Keep each screen focused on one main action.
- Use large tap targets and obvious buttons.
- Keep navigation shallow and consistent.
- Do not hide key actions behind gestures young children may not discover.
- Use icons only when they are extremely clear; otherwise pair them with audio or visual demonstration.
- Avoid visual clutter, tiny details, and decorative elements that compete with the task.
- Prefer calm, readable colour contrast over flashy overstimulation.
- Use animation to clarify meaning, not just for decoration.
- Keep latency low. Slow or unreliable interactions are especially damaging for children.

---

## Audio and Feedback Rules

- Audio should be clear, friendly, and concise.
- Spoken prompts should be short and concrete.
- Positive feedback should feel encouraging, not overhyped or manipulative.
- Error feedback should be gentle and helpful, never shaming.
- Use repeated audio patterns consistently so children learn the system.
- Avoid noisy interfaces with constant overlapping sounds.

---

## Learning Rules

- Every activity should have a clearly defined educational purpose.
- Prefer evidence-aligned early learning patterns: repetition, retrieval, modelling, guided practice, gradual release, and spaced review.
- Introduce one new challenge at a time.
- Recycle mastered content periodically so skills stay fresh.
- When teaching literacy, ensure letter names, sounds, formation, recognition, and blending are clearly distinguished and not muddled together.
- For tracing or phonics tasks, accuracy and clarity matter more than visual impressiveness.

---

## Psychology Rules

- Build confidence through small wins.
- Do not over-reward basic participation with excessive prizes, loot, streak pressure, or manipulative scarcity.
- Encourage persistence by making retrying feel normal and safe.
- Use progress signals that are simple and understandable.
- Avoid failure states that feel abrupt, loud, or emotionally negative.
- Children should leave the interaction feeling capable, not frazzled.

---

## Content Prioritisation Rules

When deciding what to build next, prioritise features in this order:

1. Anything that improves the child’s understanding of the target skill.
2. Anything that reduces confusion or frustration.
3. Anything that makes the interface clearer for pre-readers.
4. Anything that improves feedback, guidance, or adaptive support.
5. Anything that improves reliability and responsiveness.
6. Only then consider cosmetic polish, extra content, or novelty features.

---

## What to Avoid

- Feature creep.
- Adult-oriented UI patterns.
- Overly text-heavy instructions.
- Fake rewards that distract from learning.
- Long transitions, intros, or cutscenes.
- Cluttered screens.
- Unclear icons.
- Inconsistent navigation.
- Loud or chaotic audiovisual design.
- Mechanics that are fun for the developer but confusing for the child.

---

## Questions to Ask Before Adding or Changing Anything

- Does this help the child learn better?
- Does this make the next step more obvious?
- Does this reduce confusion or overload?
- Can a 5-year-old understand this without reading?
- Does this provide immediate and helpful feedback?
- Is this feature genuinely useful, or just flashy?
- Would a calm, high-quality educational app include this?

---

## Engineering Rules for AI Assistants

- Prefer small, safe, high-confidence improvements over major rewrites.
- Preserve existing working behaviour unless a change clearly improves child usability or learning.
- When suggesting new features, explain the educational reason, not just the technical implementation.
- Optimise for clarity, reliability, responsiveness, and maintainability.
- Flag any part of the design that may confuse, overload, frustrate, or manipulate young users.
- When in doubt, simplify.

---

## Success Criteria

A successful educational game for children is not one that is merely colourful or entertaining. It is one where a child can quickly understand what to do, feels safe and encouraged, receives clear feedback, stays focused on the learning goal, and leaves more capable than before.
