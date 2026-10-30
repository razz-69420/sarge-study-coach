# Sarge Study Coach

Build a clickable demo of "Sarge", a study coach for AI Bachelor students at JKU Linz. Sarge is a strict but funny drill sergeant who pushes students on their work and never insults them as people. Example lines: "Three wrong on gradient descent, recruit. We are not done here." and "Good. Don't get comfortable." This is a front-end demo only: use fictional hardcoded sample data, with no login, backend or real AI calls. Everything must be clickable, with no dead ends. DESIGN: a dark, bold, military-inspired look with olive, black and a strong amber accent, stencil-style headings and clean readable body text. It must look premium, not like a game or a parody, and work on a laptop and a phone. SAMPLE DATA: student "Recruit Alex". Fictional course "Machine Learning Foundations", exam in 12 days. Topics: Linear Regression, Gradient Descent, Regularization, Bias-Variance, Logistic Regression, Neural Network Basics. SCREEN 1, Enlistment: 6 onboarding questions, one at a time: exam date, hours per week, goal (pass, solid grade or top marks), what you would enjoy using (reading, audio or quizzes), what stops you starting, and how Sarge should help (hints first by default). SCREEN 2, Upload: drag in course slides. A simulated 2-second "Sarge is reading your material" state leads to a topic map of the 6 topics, each with a mastery bar. SCREEN 3, Battle Plan: a 12-day calendar counting back from the exam, with review sessions on each topic and the last review 2 days before the exam. SCREEN 4, Quiz: 5 multiple-choice questions mixing topics. Each has a Hint button shown before any answer, a confidence rating, and a short Sarge reaction after answering. SCREEN 5, Debrief, the key demo moment: after the quiz, show that Gradient Descent is now a weak topic. Animate its mastery bar falling, then show the Battle Plan changing, with new Gradient Descent sessions sliding into the calendar and a before and after count. Sarge says what changed and why. SCREEN 6, Service Record: Sarge's memory of the student, shown as a folder tree of Markdown notes: Profile.md, Plan.md, Courses/Machine Learning Foundations/Topics.md, Weak Topics.md, and Sessions/2026-10-31.md. Clicking a file shows its contents. After the Debrief, Weak Topics.md and the session note visibly update with a "just updated" highlight. SCREEN 7, Dashboard: exam countdown, today's orders, weak topics, streak, and a "Play audio briefing" button that animates a waveform. No real audio yet. NAVIGATION: a clear sidebar, plus a "Run demo" button that walks through the screens in order. Quiz answers must change the Debrief and Service Record through shared app state. Add a small footer: "Demo with fictional course data".

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/d61b91e2-807d-4868-b9db-5ea31bc11cde).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
