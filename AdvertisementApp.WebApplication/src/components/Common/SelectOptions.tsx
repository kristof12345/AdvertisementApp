import React, { Component } from "react";

export const generateOptions = (list: string[]) => {
    let items = [];
    for (let i = 0; i < list.length; i++) {
        items.push(<option key={i + 1}>{list[i]}</option>);
    }
    return items;
};