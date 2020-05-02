export enum Message {
  //success
  SUCCESS = "Success",
  INTERNAL_SERVER_ERROR = "Oops!! something went wrong.",
  //successfully pack of card generated
  DECK_FETCH_SUCCESS = "successfully deck suffled deck fetched.",
  //successful User creation
  USER_CREATION_SUCCESS = "successfully created new user.",
  // room created success
  ROOM_CREATED_SUCCESS = "successfully room created.",
  //card draw success
  CARD_DRAWN_SUCESS = "card drwan successfylly.",
  //failed to draw card
  CARD_DRAW_FAIL = "card cannot be drawn.",
  // player history fetched
  PLAYER_HISTORY_FETCHED = "Player history fetched successfully.",

  //player is Busy
  PLAYER_IS_BUSY = "Please wait player is right now busy on other table.",
  //room creation failed
  ROOM_CREATION_FAIL = "Room cann't be created.",
}
