import Router from "express";
import {
    addCat, removeCat, renameCat, addItemToCat,
    addTransact, removeItem, renameItem, deleteTransact,
    editTransactionPrice,
    removeCatSaveItems,
    moveItem
} from "./user.controller.js";



const userRouter = Router();

userRouter
    .post('/add_cat', addCat)
    .post('/rem_cat_items', removeCat)
    .post('/rem_cat', removeCatSaveItems)
    .post('/rename_cat', renameCat)
    .post('/add_item', addItemToCat)
    .post('/rename_item', renameItem)
    .post('/remove_item', removeItem)
    .post('/move_item', moveItem)
    .post('/add_spend', addTransact)
    .post('/edit_price', editTransactionPrice)
    .post('/delete_spend', deleteTransact)
export default userRouter;
