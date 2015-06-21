# Example T/F question without explanations #

Here's a very simple example of the syntax used to create a true/false inline quiz question:

```
    <script src="jquery.js" type="text/javascript"></script>
    <script src="inline_quiz.js" type="text/javascript"></script>
    <div class="inline_quiz_all">
        <p>The Inline Quiz tool is really cool.</p>
        <div class="right">True.</div>
        <div class="wrong">False.</div>
    </div>
```


# Example multiple choice question with explanations #

Here's an example of the syntax used to create an inline quiz question with explanations:

```
    <script src="jquery.js" type="text/javascript"></script>
    <script src="inline_quiz.js" type="text/javascript"></script>
    <div class="inline_quiz">
        <p>What state in the United States has an upper and a lower peninsula?</p>
        <div class="wrong">Hawaii</div>
        <div class="wrong">Alaska</div>
        <div class="wrong">Florida</div>
                <div class="why">Nice try, but that's not it.</div>
        <div class="right">Michigan
                <div class="why">Yes.  And the lower peninsula is shaped like a mitten.</div>
        </div>
    </div>
```


# Example of having a question reveal additional question(s)/content #

```
    <script src="jquery.js" type="text/javascript"></script>
    <script src="inline_quiz.js" type="text/javascript"></script>
    <script type="text/javascript">
        ilq_multi_start_id = "unlockSomeMoreStuff";
    </script>
    <div class="InlineQuizContainer">
        <div class="inline_quiz" id="unlockSomeMoreStuff">
            <p>Do you want to see more content and another question?</p>
            <div class="right">Yes</div>
            <div class="wrong">No</div>
        </div>
    </div>
    <p class="inline_content SomeMoreStuff">Here is more content.</p>
    <div class="inline_quiz SomeMoreStuff">
        <p>Is this a question that was hidden until the previous question was answered?</p>
            <div class="right">Yes</div>
            <div class="wrong">No</div>
        </div>
    </div>
    </div>
```