"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  $favoritedStories.hide();
  $ownStories.hide();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function navSubmitClick(evt){
  console.debug("navSubmitClick", evt);
  hidePageComponents();
  $allStoriesList.hide();
  $createStoryForm.show();
}

$navSubmit.on("click", navSubmitClick);

function navGetFavorites(evt){
  console.debug("navGetFavorites", evt);
  hidePageComponents();
  putFavorites();
}

$body.on("click", "#nav-favorites", navGetFavorites);

function navMyStories(evt){
  console.debug("navMyStories", evt);
  hidePageComponents();
  putOwnStoriesOnPage();
  $ownStories.show();
}

$body.on("click", "#nav-my-stories", navMyStories);