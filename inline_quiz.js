/*-------------------------------------------
	Inline Quiz version 3.0 
	Michigan State University
	Virtual University Design and Technology
	Creator:  Nathan Lounds with contributions by Matt Guibord
	Instructions: http://tips.angel.msu.edu/inline_quiz/
	Dependencies:  jquery.js (http://jquery.com)
		box.gif, check.gif, question.gif, x.gif, styles_inline_quiz.css
--------------------------------------------*/

var my_path = "../"; // example: "/_javascript/inline_quiz/"
var ilq_show_explanations = false;
var ilq_multi_start_id = "";
		 
vuDAT_Inline_Quiz = {
	tmp_parent: null,
	tmp_i: 1,
	initialize: function(){
		//<![CDATA[
		// loading the stylesheet into the document header
		if(document.createStyleSheet) { // non-standard IE way of doing it
			document.createStyleSheet(my_path+'styles_inline_quiz.css');
		} else { // do it the W3C DOM way
			var newCSS=document.createElement('link');
			newCSS.rel='stylesheet';
			newCSS.href=my_path+'styles_inline_quiz.css';
			newCSS.type='text/css';
			if(document.getElementsByTagName("head")[0]) {
				document.getElementsByTagName("head")[0].appendChild(newCSS);
			} else if(document.getElementsByTagName("body")[0]) {
				document.getElementsByTagName("body")[0].appendChild(newCSS);
			} else {
				document.appendChild(newCSS);
			}
		}

		$(".inline_quiz, .inline_quiz_all").each(function(i) { // screen reader cues
			$(this)
				.prepend("<div class='screen-reader'>Begin Self-Check Question</div>")
				.append("<div class='screen-reader'>End of Self-Check Question</div>");
		});
		
		$(".inline_quiz > div.right").click(function(){
			vuDAT_Inline_Quiz.ilq_click(this, true);
		});

		$(".inline_quiz > div.wrong").click(function(){
			vuDAT_Inline_Quiz.ilq_click(this, false);
		});

		$(".inline_quiz_all > div.right").click(function(){
			vuDAT_Inline_Quiz.ilq_click(this, true);
		});

		$(".inline_quiz_all > div.wrong").click(function(){
			vuDAT_Inline_Quiz.ilq_click(this, false);
		});

		//show first question of all quizzes
		elements = document.getElementsByTagName("div");
		if(elements) {
			for(i = 0; i < elements.length; ++i){
				if(elements[i].className.search(/vuDATInlineQuiz/) != -1){
					if(ilq_multi_start_id!="") {
						the_element = document.getElementById(ilq_multi_start_id);
					} else {
						the_element = elements[i].getElementsByTagName("div")[0];
					}
					if(the_element){
						$(the_element).addClass("show");
						if(the_element.className.search(/inline_content/) != -1){
							$(the_element).children("div.inline_quiz, div.inline_quiz_all").each( function() {
								$(this).addClass("show");
							});
						}
					}
				}
			}
		}
		
		// add the box images and change classes so source doesn't show if an answer is right or wrong
		$(".inline_quiz_all > div.right, .inline_quiz_all > div.wrong, .inline_quiz > div.right, .inline_quiz > div.wrong").each(function(i){
			var box = document.createElement('input');
			var tmp_parent;
			if(vuDAT_Inline_Quiz.tmp_parent!=this.parentNode) {
				vuDAT_Inline_Quiz.tmp_i = 1;
			} else {
				vuDAT_Inline_Quiz.tmp_i++;
			}
			box.type = "image";
			box.setAttribute("src",my_path+"box.gif");
			box.className = 'ilq_box';
			box.alt = (vuDAT_Inline_Quiz.tmp_i);
			this.insertBefore(box, this.firstChild);
			$(box).click(function(e) {
				e.preventDefault();
			}).keypress(function(e) {
				e.preventDefault();
			});
			//this.className = 'ilq_answer';
			vuDAT_Inline_Quiz.tmp_parent = this.parentNode;
		});
	},
	/* questionComplete()
		Add the green/red background color and border to indicate a question
		was answered correctly or incorrectly.
		Unhide the next question.
		And show explanations of question marks to toggle them. */
	questionComplete: function(resp, ans){
		var question = resp.parentNode;
		//console.log("questionComplete()");
		if(ans) {
			$(question).addClass("correctAns");
		} else {
			$(question).addClass("incorrectAns");
		}
		vuDAT_Inline_Quiz.nextQuestion(question);
		if(ilq_show_explanations==false) {
			vuDAT_Inline_Quiz.add_q_marks(question);
		} else {
			vuDAT_Inline_Quiz.show_explanations(resp);
		}
	},
	/* num_left()
		Count the number of correct responses for a question that haven't been clicked. */
	num_left: function(resp) {
		var how_many = $(resp).siblings('.right').not('.inactive').size();
		//console.log("how_many:"+how_many);
		return how_many;
	},
	nextQuestion: function(prev_question){
		var class_to_unlock = prev_question.id.replace('unlock','');
		if(class_to_unlock != ""){
			$("."+class_to_unlock).addClass("show").slideDown("slow");
			$("."+class_to_unlock).each(function(i) {
				if(i==0) {  // only scroll once
					var targetOffset = $(this).offset();
					$("html,body").animate({scrollTop: targetOffset.top}, 1000);
				}
				if($(this).is(".inline_content")) {
					$(this).children("div.inline_quiz_all, div.inline_quiz").addClass("show");	
				}
			});
		}
	},
	show_all_answers: function(question) {
		//console.log("show_all_answers answers");
		$(question).find(".right, .wrong").each(function(i) {
			$(this).trigger("click");
		});
	},
	/* ilq_click()
		Handler for when a correct response is clicked and question is set to allow user
		keep guessing until they get it right. */
	ilq_click: function(resp, iscorrect) {
		//console.log("ilq_click()");
		var q_all = $(resp).parent().hasClass(".inline_quiz_all");
		$(resp).addClass("manually_clicked").addClass("inactive").unbind('click');
		
		if(vuDAT_Inline_Quiz.num_left(resp)==0 || (q_all==true && iscorrect==false)) {
			// got all correct responses, or wrong answer and you're not allowed any
			vuDAT_Inline_Quiz.questionComplete(resp,iscorrect);
		}		
		
		vuDAT_Inline_Quiz.do_click(resp, iscorrect);
	},
	show_explanations: function(response) {
		//console.log("show_explanations()"+$(response).text());
		$(response)
			.parent()
			.children(".right, .wrong")
			.each(function() {
				vuDAT_Inline_Quiz.do_click(this, $(this).hasClass("right"));	   
			});
	},
	add_q_marks: function(elem) {
		//console.log("add_q_marks()"+$(elem).text());
		$(elem)
			.children(".right, .wrong")
			.not(".inactive")
			.unbind('click')
			.each(function() {
				vuDAT_Inline_Quiz.do_click(this, $(this).hasClass("right"));  
			});
	},
	do_click: function(response, correct) {
		//console.log("do_click()"+ $(response).text() + "::" + correct);
		var img_name;
		var color;
		var expl;
		var clicked = $(response).hasClass("manually_clicked");
		var alt = '';
		if(correct===true) {  // response is correct
			$(response).css('font-weight','bold');
			color = '#2EB231';
			img_name = 'check.gif';
			alt = "Correct answer.";
			if(ilq_show_explanations===true) {  // show explanation
				expl = true;
				if(clicked===true) {  // response was physically clicked

				} else {  // response programmactically 'clicked'
					img_name = "box.gif";	
					alt = "Correct answer you didn't choose.";
				}
			} else { // don't show explanation
				expl = false;
				if(clicked===true) {  // response was physically clicked
					expl = true;
				} else {  // response programmactically 'clicked'
					img_name = "question.gif";
					alt = "Correct answer you didn't choose.";
				}
			}
		} else { // response is incorrect
			color = '#ff0000';
			img_name = 'x.gif';
			alt = "Incorrect answer.";
			if(ilq_show_explanations===true) {
				expl = true;
				if(clicked===true) {  // response was physically clicked

				} else {  // response programmactically 'clicked'
					img_name = 'box.gif';
					alt = "Incorrect answer you didn't choose.";
				}
			} else {
				expl = false;
				if(clicked===true) {  // response was physically clicked
					expl = true;
				} else {  // response programmactically 'clicked'
					img_name = 'question.gif';
					alt = "Incorrect answer you didn't choose.";
				}
			}
		}
		$(response)
			.find('input:first') // switching to image
			.attr('alt',alt);
		if($(response).parent().find(".why, .because").size()==0 && img_name=='question.gif') {
			// leave the image as a box and don't add a click function if there is no explanation
			vuDAT_Inline_Quiz.convertInput2Image($(response).find('input:first'));
		} else {
			$(response)
				.find('input:first') // switching to image
				.attr('src',my_path+img_name)
				.each(function() {
					if(ilq_show_explanations==false) {
						$(this).css('cursor','pointer').click(function() {
							$(this).parent().find(".why, .because").each(function() {
								if(this.className=="why") {
									this.className = "because";	
								} else {
									this.className = "why";
								}
							});
						});
					} else {
						vuDAT_Inline_Quiz.convertInput2Image(this);	
					}
				})
		}
		$(response)
			.css('color',color)
			.unbind('click')
			.addClass('inactive')
			.find(".why").each(function() {
				if(expl==true) {
					$(this).removeClass("why").addClass("because");	
				}
			});
	},
	/* convertInput2Image()
		Converts an image input to a regular image so that screen readers stop calling it a button. */
	convertInput2Image: function(input) {
		//console.log("convertInput2Image()");
		var img = document.createElement('img');
		img.setAttribute("src",$(input).attr('src'));
		img.className = input.className;
		img.setAttribute("style",$(input).attr('style'));
		img.setAttribute("alt",$(input).attr('alt'));
		$(input).before(img).remove();
	}
};

$(document).ready(function() {
	vuDAT_Inline_Quiz.initialize();
});