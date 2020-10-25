import {useState, useEffect, useReducer} from 'react';
import {usePaginatedQuery} from "react-query";
import {sendHttp} from "../../network/sendHttp";
import qs from 'querystring';

export const useDatatable = (url, requestData, initialConfig) => {

    initialConfig = {
        skip: 0,
        limit: 25,
        search: "",
        searchColumns: [],
        order: "desc",
        orderBy: "_id",
        ...(initialConfig || {}),
    };

    const [total, setTotal] = useState(0);
    const [config, setConfig] = useReducer((state, newState) => ({...state, ...newState}), initialConfig);

    const query = usePaginatedQuery([url, requestData, config], (_, requestData, config) => {
        const q = qs.stringify({
            limit: config.limit,
            skip: config.skip,
            search: config.search,
            searchColumns: config.searchColumns,
            order: config.order,
            orderBy: config.orderBy,
            ...(requestData || {}),
        })
        return sendHttp({
            url: `${url}?${q}`,
        });
    });

    const {data} = query;

    useEffect(() => {
        if (data && data.total) {
            setTotal(data.total);
        }
    }, [data]);

    return {
        ...query,
        config,
        setConfig,
        total,
    };
};