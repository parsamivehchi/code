'use strict';

var firstpage = document.querySelector('.page.firstpage');
var secondpage = document.querySelector('.page.secondpage');
var screen = document.querySelector('.screen');
var firstpagecircle = document.querySelector('.circle.first');
var secondpagecircle = document.querySelector('.circle.second');
Hammer(screen).on('swipeleft', function () {
	firstpage.style.left = '-100%';
	secondpage.style.left = '0px';
	firstpagecircle.classList.remove('active');
	secondpagecircle.classList.add('active');
});

Hammer(screen).on('swiperight', function () {
	firstpage.style.left = '0px';
	secondpage.style.left = '400px';
	firstpagecircle.classList.add('active');
	secondpagecircle.classList.remove('active');
});