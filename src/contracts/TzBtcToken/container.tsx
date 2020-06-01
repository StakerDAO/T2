import React from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { BigNumber } from 'bignumber.js';

import transactionsEmptyState from '../../../resources/transactionsEmptyState.svg';

import BalanceBanner from '../../components/BalanceBanner';
import PaginationList from '../../components/PaginationList';
import { TRANSACTIONS, SEND } from '../../constants/TabConstants';
import { RootState } from '../../types/store';
import { updateActiveTabThunk } from '../../reduxContent/wallet/thunks';

import Transactions from '../components/TransactionContainer';
import Send from '../components/Send';
import { Container, Tab, TabList, TabText, SectionContainer } from '../components/TabContainer/style';
import { getTokenSelector } from '../duck/selectors';
import { transferThunk } from './thunks';

const ActionPanel = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const selectedToken = useSelector(getTokenSelector);
    const { selectedParentHash, selectedAccountHash } = useSelector((rootState: RootState) => rootState.app, shallowEqual);
    const { activeTab, displayName, administrator, transactions } = selectedToken;
    const isAdmin = selectedParentHash === administrator;
    const tabs = isAdmin ? [TRANSACTIONS, SEND] : [TRANSACTIONS, SEND];
    const list = transactions.filter(e => e).sort((a, b) => b.timestamp - a.timestamp);

    const onChangeTab = (newTab: string) => {
        dispatch(updateActiveTabThunk(newTab, true));
    };

    return (
        <Container>
            <BalanceBanner
                isReady={true}
                balance={selectedToken.balance}
                privateKey={''}
                publicKeyHash={selectedAccountHash || 'Inactive'}
                delegatedAddress={''}
                displayName={displayName}
                symbol={selectedToken.symbol}
            />

            <TabList count={tabs.length}>
                {tabs.map(tab => (
                    <Tab isActive={activeTab === tab} key={tab} ready={true} buttonTheme="plain" onClick={() => onChangeTab(tab)}>
                        <TabText ready={true}>{t(tab)}</TabText>
                    </Tab>
                ))}
            </TabList>
            <SectionContainer>
                {activeTab === SEND && <Send isReady={true} token={selectedToken} tokenTransferAction={transferThunk} />}
                {activeTab === TRANSACTIONS && (
                    <PaginationList
                        list={list}
                        ListComponent={Transactions}
                        listComponentProps={{ selectedParentHash, token: selectedToken }}
                        componentListName="transactions"
                        emptyState={transactionsEmptyState}
                        emptyStateTitle={t('components.actionPanel.empty-title')}
                    />
                )}
            </SectionContainer>
        </Container>
    );
};

export default ActionPanel;
