# Series of Content #
You can set up the Inline Quiz tool so that when you complete a question, some other question(s) and/or content is revealed.

  1. Put everything inside a div with the class 'InlineQuizContainer'
  1. Give the first question a unique ID
  1. Use that ID as a CSS class on the element(s) you want revealed when the question is completed.  The elements can be questions (divs with class 'inline\_quiz' or 'inline\_quiz\_all') or divs with the class 'inline\_content'

If you want something other than the first div to be the first question showed you'll need set the ilq\_multi\_start\_id variable to match the ID you used.

Let me know if you need more detailed instructions.