# Sarge Study Coach

A study coach for AI Bachelor students at JKU Linz, with a strict but funny drill-sergeant personality. Built at the Hacktoberfest Hack Day Linz x Young AI Leaders Linz.

**Status: clickable demo.** It runs on fictional course data. It does not read real files, call an AI model or play real audio yet.

## What the Demo Shows

1. **Enlistment:** six onboarding questions
2. **Upload:** a simulated topic map from course slides
3. **Battle Plan:** a 12-day study calendar counting back from the exam
4. **Quiz:** multiple-choice questions with hints and confidence ratings
5. **Debrief:** wrong answers mark a topic as weak and add sessions to the plan
6. **Service Record:** the student's memory, shown as a folder of Markdown notes that updates after each quiz
7. **Dashboard:** exam countdown, today's orders and weak topics

## Planned

- Gemma 4 reads course material, builds the topic map and writes quizzes
- ElevenLabs audio briefings
- `ts-fsrs` spaced-repetition scheduling
- Local mode through Ollama, so student data stays on the laptop

## Run Locally

```sh
git clone https://github.com/razz-69420/sarge-study-coach.git
cd sarge-study-coach
npm i
npm run dev
```

## AI Tools Used

- [Lovable](https://lovable.dev): generated the UI and app code
- [Claude](https://claude.com/claude-code): planning, prompts and repo setup

## Presentation

[Slides (PDF)](docs/presentation.pdf)

## License

[MIT](LICENSE)
