# [adamzielonka.pro](https://adamzielonka.pro)

## How to use
1. Go to website [adamzielonka.pro](https://adamzielonka.pro)
2. Wait for start scripts ends. 
3. Type something.
4. Press Enter key.
5. Enjoy ;-)

## Command file

This app interpreted a markdown file with attributes section written in yaml. You can see my files in repo: [./src/commands/](./src/commands/).

### Attributes

In optional yaml section, you can set: 

- `command` - name, that will be use to execute command by user
- `alias` - table of aliases, that can by used also to execute command by user
- `help` - text, that wiil by shown in help command 

### Body

All line in markdown section will be printed line by line, with links interpretations.

You can also use special links, that will be affected to the app:

- `sleep:` - wait before print next line
- `system:` - system instruction, applies to next line
  - `:clear` - clear standard output
  - `:shutdown` - shutdown the machine
  - `:freeze` - freeze the machine
  - `:echo` - print args
  - `:help` - print available instruction
- `constans:` - this links will be replaced with:
  - `:command` - name of command

## History

### Beginning - Static Website

In June 2017, my friend show me his website and after I sew, I realized that I want have the own website. So I copied his website, and rebuild for myself:

![](./img/2017-06-12.png)

But creating the same website like friend isn't fair to the friend, so I rewrite again. My idea was to create website that looks like terminal. 

![](./img/2017-06-12.2.png)
![](./img/2017-06-14.png)
![](./img/2017-06-15.png)
![](./img/2017-06-15.2.png)
![](./img/2017-06-18.png)

Website was very empty, no project that can promote me, so in October 2017, I add my first projects:

![](./img/2017-10-06.png)

Website wasn't presenting information, so on beginning of 2018 I rebuild the whoami layout.

![](./img/2018-01-17.png)
![](./img/2018-01-28.png)
![](./img/2018-02-04.png)

When autumn 2018 came, I did last correction.

![](./img/2018-09-23.png)

### React - Interaction Website

In March 2019, I decided to move website React.js and I did it. Static website was put in noscript section. Yea. But it wasn't very good code to edit, so page look very similar to the static website. One different was animation, but it think it is possible to get the same effect using css.

In August 2019, I had the breakdown. I rewrite the terminal code, that me allow to add interaction. I also rewrite the animation form no-script version of website, so no differences between static and react version.

![](./img/2019-08-17.png)

## Licence
MIT
