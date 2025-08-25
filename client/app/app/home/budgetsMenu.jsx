import { useState, useEffect } from 'react'
import { View, Text } from 'react-native';
import Button from '../../components/common/button.jsx';
import CreateProfileBudget from '../../components/budgets/createProfileBudget.jsx';

export default function BudgetsMenu() {
    return (
        <View>
            <CreateProfileBudget />
        </View>
    )
}