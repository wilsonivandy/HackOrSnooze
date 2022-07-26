"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDelete = false) {
  //console.debug("generateStoryMarkup", story);
  const hostName = story.getHostName();
  const showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
        ${showDelete ? getDeleteBtn() : ""}
        ${showStar ? getStarHTML(story, currentUser) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

function getDeleteBtn(){
  return `
    <span class="trash-can">
        <i class="fas fa-trash-alt"></i>
    </span>`;
}

function getStarHTML(story, user){
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
  <span class="star">
    <i class="${starType} fa-star"></i>
  </span>`;
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
}

async function deleteStory(evt){
  console.debug("deleteStory");
  const $closestLI = $(evt.target).closest("li");
  const storyId = $closestLI.attr("id");
  await storyList.removeStory(currentUser, storyId);
}

$ownStories.on("click", ".trash-can", deleteStory);

async function createNewStory(evt){
  console.debug("createNewStory");
  evt.preventDefault();
  const title = $("#input-title").val();
  const author = $("#input-author").val();
  const url = $("#input-url").val();
  const username = currentUser.username;
  const storyData = {title, author, url};

  const story = await storyList.addStory(currentUser, storyData);
  const $story = generateStoryMarkup(story);
  $allStoriesList.prepend($story);
  $(':input').val('');
  $createStoryForm.hide();
  $allStoriesList.show();
}

$createStoryForm.on("submit", createNewStory);

function putOwnStoriesOnPage(){
  console.debug("putOwnStoriesOnPage");
  $ownStories.empty();
  if (currentUser.ownStories.length === 0){
    $ownStories.append("<h5>No Stories Added Yet </h5>");
  } else {
    for (let story of currentUser.ownStories) {
      let $story = generateStoryMarkup(story, true);
      $ownStories.append($story);
    }
  }
  $ownStories.show();
}

function putFavorites(){
  console.debug("putFavorites");
  $favoritedStories.empty();
  if (currentUser.favorites.length === 0){
    $favoritedStories.append("<h5>No Favorites Added Yet </h5>");
  } else {
    for (let story of currentUser.favorites) {
      let $story = generateStoryMarkup(story);
      $favoritedStories.append($story);
    }
  }
  $favoritedStories.show();
}

async function toggleFavorite(evt){
  console.debug("toggleFavorite");
  const $target = $(evt.target);
  const $closestLI = $target.closest("li");
  const storyId = $closestLI.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);
  if ($target.hasClass("fas")) {
    await currentUser.removeFavorite(story);
    $target.closest("i").toggleClass("fas far");
  } else {
    await currentUser.addFavorite(story);
    $target.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleFavorite);
