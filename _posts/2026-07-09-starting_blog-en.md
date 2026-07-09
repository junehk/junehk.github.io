---
title: "Getting Started with Blogging"
category: coding
tags: [Jekyll, Claude Code]
lang: en

---

## Motivation

1. Needed a platform to document coding experiments and biological research
2. Wanted to reach beyond Korean audiences and regional platforms
3. Decided against centralized platforms like Medium, Naver Blog, or Notion in favor of building something myself
4. Chose GitHub Pages + Jekyll for their open-source nature and accessibility
5. Prefer writing in Markdown format for simplicity and version control
6. Aim to learn alongside Claude Code rather than simply generating a complete site—understanding the process matters

## Tools & Environment

1. Claude, Claude Code
2. macOS + Miniforge

## GitHub Pages

For developers, GitHub Pages is a familiar platform. However, those who have spent years primarily in wet lab work often find this space less approachable.

In 2019, through a biostatics course at Korea University (essentially a data visualization course using R) taught by Professor Ahn Joon-yong, I first encountered programming and GitHub. Despite not actively using GitHub until now, I chose this platform for three key advantages: **it's free**, **developer-friendly**, and **it provides personal website hosting**.

![Github Page 문서](/images/post/2026-07-09-starting_blog/Githubpage.png)

More information can be found in the [GitHub Pages documentation](https://docs.github.com/en/pages).

## Installation

### Jekyll

GitHub Pages recommends using Jekyll to build static sites. I followed the official installation guide to set up my environment.

![Jekyll installation](/images/post/2026-07-09-starting_blog/jekyllrb_install.png)

I used the [Jekyll installation guide for macOS](https://jekyllrb.com/docs/installation/macos/) to set up everything. Successfully installed `jekyll`, `gem`, and `bundler`.

Let's create a `./myblog` folder and set up the environment there.

```bash
# Create ./myblog folder and initialize Jekyll
jekyll new myblog

# Navigate to myblog
cd myblog

# Run Jekyll
bundle exec jekyll serve
```

![Jekyll Terminal Run](/images/post/2026-07-09-starting_blog/jekyll_terminal_exec.png)

Visit `http://localhost:4000` in your browser to see the default homepage. To stop the server, press `Ctrl + C` in the terminal.

![Jekyll Terminal Run](/images/post/2026-07-09-starting_blog/jekyll_initial_page.png)

The default theme has many empty areas. Now I decided to use Claude Code to customize the site and learn the details along the way.

## Claude Code–Driven Development

![Jekyll Serif Theme](/images/post/2026-07-09-starting_blog/Jekyll_serif_theme.png)

I selected the [Jekyll Serif Theme](https://github.com/zerostaticthemes/jekyll-serif-theme). Its structure was clean and well-organized.

![Previous web site](/images/post/2026-07-09-starting_blog/previous_web_page.png)

While adopting this theme, I decided to integrate design elements from a previous practice homepage I had built using only `index.html` with AI assistance.

### Development Plan

Before using Claude Code, I outlined the requirements:

1. Bilingual Support (English & Korean)
   - English as the default language
   - Automatic Korean display for Korean-language browsers
2. Homepage Components
   - Brief bio section
   - Blog post listings
   - Publication list
   - Contact information at the footer
3. Theme-Based Customization
   - Build upon the selected theme
   - Incorporate elements from the previous homepage design

### Development Process

I navigated to the Jekyll Serif folder in VSCode and explained the requirements to Claude Code.

![vscode_claude_please_do_it](/images/post/2026-07-09-starting_blog/vscode_claude_please_do_it.png)

Through iterative refinement and targeted adjustments, a clean homepage came together. I learned about file structure for maintenance and blogging best practices through Claude Code.

![Bunch of files compared to the first index.html only system](/images/post/2026-07-09-starting_blog/file_list.png)

Finally, I pushed everything to GitHub to complete the project.
