/*-------------------------------------------
	Inline Quiz version 3.0 
	Michigan State University
	Virtual University Design and Technology
	Creator:  Nathan Lounds with contributions by Matt Guibord
	Project Page: http://code.google.com/p/inline-quiz-js/
	Dependencies:  jquery.js (http://jquery.com)
		box.gif, check.gif, question.gif, x.gif, styles_inline_quiz.css
--------------------------------------------*/

var ilq_show_explanations = false;
var ilq_multi_start_id = "";

Inline_Quiz = {
	tmp_parent: null,
	tmp_i: 1,
	path: "",
	initialize: function(){
		if((typeof my_path!="undefined")&&(typeof ilq_path=="undefined")) {
			Inline_Quiz.path = my_path;  // backwards compatability with my_path var
		} else if(typeof ilq_path!="undefined") {
			Inline_Quiz.path = ilq_path;
		}
		//<![CDATA[
		// loading the stylesheet into the document header
		if(document.createStyleSheet) { // non-standard IE way of doing it
			document.createStyleSheet(Inline_Quiz.path+'styles_inline_quiz.css');
		} else { // do it the W3C DOM way
			var newCSS=document.createElement('link');
			newCSS.rel='stylesheet';
			newCSS.href=Inline_Quiz.path+'styles_inline_quiz.css';
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
			Inline_Quiz.ilq_click(this, true);
		});

		$(".inline_quiz > div.wrong").click(function(){
			Inline_Quiz.ilq_click(this, false);
		});

		$(".inline_quiz_all > div.right").click(function(){
			Inline_Quiz.ilq_click(this, true);
		});

		$(".inline_quiz_all > div.wrong").click(function(){
			Inline_Quiz.ilq_click(this, false);
		});

		//show first question of all quizzes
		var selector = "#"+ilq_multi_start_id;
		if(ilq_multi_start_id=="") {
			selector = ".InlineQuizContainer div:first";
		}
		$(selector).addClass("show").children("div.inline_quiz, div.inline_quiz_all").each( function() {
			$(this).addClass("show");
		});
		
		// add the box images and change classes so source doesn't show if an answer is right or wrong
		$(".inline_quiz_all > div.right, .inline_quiz_all > div.wrong, .inline_quiz > div.right, .inline_quiz > div.wrong").each(function(i){
			var box = document.createElement('input');
			var tmp_parent;
			if(Inline_Quiz.tmp_parent!=this.parentNode) {
				Inline_Quiz.tmp_i = 1;
			} else {
				Inline_Quiz.tmp_i++;
			}
			box.type = "image";
			box.setAttribute("src",Inline_Quiz.path+"box.gif");
			box.className = 'ilq_box';
			box.alt = (Inline_Quiz.tmp_i);
			this.insertBefore(box, this.firstChild);
			$(box).click(function(e) {
				e.preventDefault();
			}).keypress(function(e) {
				e.preventDefault();
			});
			Inline_Quiz.tmp_parent = this.parentNode;
		}).mouseover(function() {
			$(this).addClass("ilq_hover");
		}).mouseout(function() {
			$(this).removeClass("ilq_hover");
		});
	},
	/* questionComplete()
		Add the green/red background color and border to indicate a question
		was answered correctly or incorrectly.
		Unhide the next question.
		And show explanations of question marks to toggle them. */
	questionComplete: function(resp, ans){
		var question = resp.parentNode;
		if(ans) {
			$(question).addClass("correctAns");
		} else {
			$(question).addClass("incorrectAns");
		}
		Inline_Quiz.nextQuestion(question);
		if(ilq_show_explanations==false) {
			Inline_Quiz.add_q_marks(question);
		} else {
			Inline_Quiz.show_explanations(resp);
		}
	},
	/* num_left()
		Count the number of correct responses for a question that haven't been clicked. */
	num_left: function(resp) {
		var how_many = $(resp).siblings('.right').not('.inactive').size();
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
		$(question).find(".right, .wrong").each(function(i) {
			$(this).trigger("click");
		});
	},
	/* ilq_click()
		Handler for when a correct response is clicked and question is set to allow user
		keep guessing until they get it right. */
	ilq_click: function(resp, iscorrect) {
		var q_all = $(resp).parent().hasClass(".inline_quiz_all");
		$(resp).addClass("manually_clicked").addClass("inactive").unbind('click').unbind('mouseover').unbind('mouseout');
		
		if(Inline_Quiz.num_left(resp)==0 || (q_all==true && iscorrect==false)) {
			// got all correct responses, or wrong answer and you're not allowed any
			Inline_Quiz.questionComplete(resp,iscorrect);
		}		
		Inline_Quiz.do_click(resp, iscorrect);
	},
	show_explanations: function(response) {
		$(response)
			.parent()
			.children(".right, .wrong")
			.each(function() {
				Inline_Quiz.do_click(this, $(this).hasClass("right"));	   
			});
	},
	add_q_marks: function(elem) {
		$(elem)
			.children(".right, .wrong")
			.not(".inactive")
			.unbind('click')
			.each(function() {
				Inline_Quiz.do_click(this, $(this).hasClass("right"));  
			});
	},
	do_click: function(response, correct) {
		var img_name;
		var color;
		var expl;
		var clicked = $(response).hasClass("manually_clicked");
		var alt = '';
		var num_explanations = $(response).find(".why, .because").size();
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
					if(num_explanations==0) {
						img_name = 'box.gif';
					} else {
						img_name = 'question.gif';
					}
					alt = "Incorrect answer you didn't choose.";
				}
			}
		}
		$(response)
			.find('input:first') // switching to image
			.attr('alt',alt);
		if(num_explanations==0 && img_name=='question.gif') {
			// leave the image as a box and don't add a click function if there is no explanation
			Inline_Quiz.convertInput2Image($(response).find('input:first'));
		} else {
			$(response)
				.find('input:first') // switching to image
				.attr('src',Inline_Quiz.path+img_name)
				.each(function() {
					if(ilq_show_explanations==false) {
						if(num_explanations==0) {
							Inline_Quiz.convertInput2Image(this);	
						}
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
						Inline_Quiz.convertInput2Image(this);	
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
		var img = document.createElement('img');
		img.setAttribute("src",$(input).attr('src'));
		img.className = "ilq_box";
		img.setAttribute("style",$(input).attr('style'));
		img.setAttribute("alt",$(input).attr('alt'));
		$(input).before(img).remove();
	}
};

$(document).ready(function() {
	Inline_Quiz.initialize();
});