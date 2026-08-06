---
title: "1.3 Dev Environment"
sidebar_position: 3
---

**Topics:** Git, Repositories, Commits, VS Code

## Learning Objectives

By the end of this section, you will be able to:

- Install and configure a development environment.
- Create a Git repository and make commits.
- Navigate a codebase in VS Code.

You will have done the following

- [ ] Created a GitHub account
- [ ] Installed Git, Node.js, and VS Code
- [ ] Submitted the form to create your own copy of the Work Sample repository
- [ ] Cloned the Work Sample repository and installed its dependencies
- [ ] Run the project locally and verified it works
- [ ] Installed VS Code extensions for Prettier and ESLint
- [ ] Disabled AI autocomplete features in VS Code
- [ ] Make your first commit to the Work Sample repository

## Setting Up

Making web applications is complicated, so we are going to be really pushy about your environment's setup. Everyone installs the same tools, the same versions, configured the same way. If this seems limiting, that's the idea. Every hour spent debugging a broken environment is an hour where you're not learning.

You're going to need six things to get started:

1. A GitHub account.
2. Git
3. Node Version Manager
4. Node.js
5. The Work Sample repository
6. Visual Studio Code

Some of these steps might give you trouble. If you get stuck, ask a classmate or a TA. But you do need to figure it out.

## GitHub

First things first, you will need a GitHub account if you don't already have one.

Get one from here: [github.com](https://github.com)

Use a username you would be comfortable putting on your resume, because you will.

## Get Git

You're going to need to have Git installed on your computer.

You might already have it, but if you don't, you'll need to install it from [git-scm.com](https://git-scm.com).

If there are any options about adding Git to your PATH, choose yes.

### What Git Is

Git is a system for recording the history of a folder of files. It is distinct from GitHub, which is a website that hosts Git repositories. You can use Git without GitHub, but you cannot use GitHub without Git.

Memorize these terms:

- A **repository** is a folder whose history Git is tracking, plus that entire history.
- GitHub (and alternatives like GitLab or BitBucket) is a website hosting a ton of these repositories, which you can **clone** onto your computer to get your own copy of the files and their history.
- We say that the repositories on GitHub are the **remote**, and the version on your computer is the **local**.
- You **push** commits to a remote and **pull** commits from a remote. This let's you share your work with others and get their work.
- A **commit** is a snapshot of the whole project at a moment you chose, with a message saying what changed and why.
- A repository is essentially a chain of commits called the history, the timeline of the edits of the project.

TODO: Need to make a diagram

Git is great because it is:

- an undo button that spans the entire history of the project,
- a record of who changed what and why, and
- the mechanism that lets multiple people edit the same codebase without emailing zip files at each other.

Nearly everything in this course flows through Git, including turning in your work.

### Never Email Code Again

You're never going to email code to anyone again. That looks super weird to a professional engineer. Instead, you will share code via GitHub. If you are only trying to share a short snippet, then you could use a Gist, which is a GitHub feature for sharing single files. But if you are sharing more than one file, you will always use a repository.

### Check Git

Before you continue, verify that you have Git working in your terminal. Open a terminal and run:

```bash
git --version
```

Make sure that something like `git version 2.39.1` prints. If it does not, you need to fix your Git installation before continuing.

## Node and a Node Version Manager

Node.js is the runtime that runs JavaScript outside of a browser. It is what runs the build tools and the server for this project. You will need to install Node.js, but first you need a Node version manager. NVM lets you install multiple versions of Node.js on your machine and switch between them. This is important because different projects may require different versions of Node.js. At the time of writing, I have 7 versions of Node installed on my machine.

There are several Node version managers out there, including one actually named "Node Version Manager" (NVM). The one we recommend is called **Volta**. It is a little more modern, and it works on Windows, Mac, and Linux.

Get Volta here and install it: [https://docs.volta.sh/guide/getting-started](https://docs.volta.sh/guide/getting-started)

Then you can open a terminal and run the following to install an appropriate version of Node:

```bash
volta install node@22
```

With that, you should have Node.js installed. Verify it by running:

```bash
node --version
```

If it's not available, make sure you close and reopen your terminal, and then run the command again. Most programs will not see newly installed programs until you restart them.

## Get the Work Sample

To get the Work Sample, you will need to fill out the appropriate form on Canvas in the corresponding assignment. The form will ask you for various pieces of information, including your GitHub username. After you submit the form, a new version of the Work Sample repository will be created for you on GitHub. You will need to check your notifications on GitHub. It might take a little while for the repository to be created, but if it takes more than 10 minutes, you will need to fill out the "Onboarding Help" form on Canvas.

Once you have access to the repository, **clone** your fork using the green button to get the URL, and then run the following commands in your terminal:

```bash
git clone THE_URL_YOU_COPIED_FROM_GITHUB
cd quizzer-work-sample
npm install
```

`npm install` downloads every library the project depends on into a folder called `node_modules`. It will be a few hundred megabytes. This is insane, but welcome to the future: modern web tooling is a tall stack of other people's work, and this is what standing on it costs. You never commit `node_modules`, and the project is already configured to ignore it.

Then prove everything works:

```bash
npm run dev
```

Open the address Vite prints, and you should see the Quizzer application shell. That page is what your five epochs will grow into an application.

## VS Code

Once you have the project installed locally, you will need an editor to work in. You will be using VS Code for this course. It is free, cross-platform, and has a ton of extensions that make it a great editor for web development.

Install it from [https://code.visualstudio.com/Download](https://code.visualstudio.com/Download)

Once VS Code is open, find the folder you cloned and open it. You should see the project files in the left sidebar.

MAKE SURE THAT YOU OPEN THE FOLDER, NOT A PARENT OR CHILD FOLDER. If you open the wrong folder, the project will not work correctly. Often, folks will open a folder named `src` or the parent folder of the project. You need to open the folder that contains `package.json` and `vite.config.js`.

### VS Code Extensions

Install **ESLint** and **Prettier** from the Extensions panel. The project is configured so Prettier formats your file every time you save and ESLint underlines problems as you type. We'll explain them in more detail later.

### Disabling AI Completion

If you are prompted to turn on AI autocomplete features, do not do so. **We recommend disabling AI autocomplete for the first five weeks.** If Copilot or a similar tool is installed, turn it off for this project. The midterm interview is on paper, and AI is not allowed.

You are going to need to have Github integrated into your environment, so follow any prompts to do so.

Make sure that you can successfully run the project using the terminal inside of VS Code.

## Your First Commit

Once you have your environment all set up, you will need to make your first commit. A commit is a snapshot of the project at a point in time. You will be making commits throughout the course.

Disciplined commit messages are important. They are the history of your project, and they should be clear and concise. A good commit message should answer the question: "What changed and why?" They are usually just a single line, often less than a sentence. For example, a commit message might be "Add a new feature to the quiz" or "Fix a bug in the scoring algorithm."

To make your first commit, first modify a file and save the changes. In this case, you can modify the `README.md` file in the root of the project. Add a line that says "My first commit" and save the file.

Then, in the terminal, run the following commands:

```bash
git add README.md
git commit -m "Add a line to the README"
git push
```

You can also do this from the VS Code interface. You should see the changes in the Source Control panel. Click the "+" next to the file to stage it, then click the checkmark to commit it. Finally, click the "..." and select "Push" to push your changes to GitHub.

You will need to get used to both interfaces, the command line and the VS Code interface.

MAKE SMALL COMMITS REGULARLY. A good pattern is to commit after each problem in the course. You might also make commits as checkpoints so that you can roll back to a known good state if you get stuck. You will be graded on your commits down the road, so get good habits now.

## Coming Up

Your environment can now run the project. Before writing any code, the next section explains the working rhythm the course borrows from industry: agile, sprints, and why the work is arranged in weekly slices at all.
