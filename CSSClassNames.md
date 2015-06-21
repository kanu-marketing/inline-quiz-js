# CSS Class Names #

## inline\_quiz ##
A div with this class is the basic construct for a multiple-choice question.  Clicking an incorrect response within the question (div with class=wrong) will not result in the question being completed.  So users can keep guessing until they find the answer(s).

_Example:_
```
<div class="inline_quiz">
	<p>What is the 6-5?</p>
	<div class="right">1</div>
	<div class="wrong">2</div>
	<div class="wrong">3</div>
</div>
```

## inline\_quiz\_all ##
A div with this class is the basic construct for a multiple-choice question.  Clicking an incorrect response within the question (div with class=wrong) completes the question as incorrect.  No guessing once you've missed.

_Example:_
```
<div class="inline_quiz_all">
	<p>True or False: Elvis is still alive.</p>
	<div class="right">True</div>
	<div class="wrong">False</div>
</div>
```

## right ##
Inside an Inline Quiz question there should be at least one div with this class.  This div(s) should contain the correct answer(s) to the question.

_Example:_
```
<div class="inline_quiz_all_quiz">
	<p>True or False: Elvis is still alive.</p>
	<div class="right">True</div>
	<div class="wrong">False</div>
</div>
```

## wrong ##
Use this class on divs inside of Inline Quiz questions for incorrect responses.

_Example:_
```
<div class="inline_quiz_all_quiz">
	<p>True or False: Elvis is still alive.</p>
	<div class="right">True</div>
	<div class="wrong">False</div>
</div>
```

## why ##
Use this class on a div inside an response to provide an explanation as to why a response is correct or incorrect.

_Example:_
```
<div class="inline_quiz_all_quiz">
	<p>True or False: Elvis is still alive.</p>
	<div class="right">True
		<div class="why">Correct. He died August 16, 1977.</div>
	</div>
	<div class="wrong">False
		<div class="why">Incorrect.  Some people claim he is still alive, but he isn't.</div>
	</div>
</div>
```

## InlineQuizContainer ##
If you want to have a series of questions/content that are revealed as question(s) are completed, you'll need to place the all in a div with this class.

## inline\_content ##
Use this class for content that you want to have revealed when a question is completed.

_Note: The content will ALSO need to have a CSS class that matches the ID attribute of the inline\_quiz/inline\_quiz\_all div that is to cause the revealing._