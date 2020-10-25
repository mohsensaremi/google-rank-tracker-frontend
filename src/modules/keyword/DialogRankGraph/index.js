import React, {useEffect, useRef} from 'react';
import MuiDialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import {useTheme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {useQuery} from "react-query";
import {useSendHttp} from "../../../utils/network/useSendHttp";
import Chart from 'chart.js';

const Dialog = (props) => {

    const {
        open,
        onClose,
        keyword,
    } = props;

    return (
        <MuiDialog
            open={open}
            onClose={onClose}
            fullScreen
        >
            <DialogContent>
                {
                    keyword && (
                        <Component
                            keyword={keyword}
                        />
                    )
                }
            </DialogContent>
            <DialogActions>
                <Button
                    variant={"outlined"}
                    color={"primary"}
                    onClick={onClose}
                >
                    Close
                </Button>
            </DialogActions>
        </MuiDialog>
    );
};

const Component = (props) => {

    const {
        keyword,
    } = props;

    const theme = useTheme();

    const ctxRef = useRef(null);

    const sendHttp = useSendHttp();

    const {data} = useQuery(`/keyword-rank/graph`, () =>
        sendHttp({
            method: "GET",
            url: `/keyword-rank/graph?keywordId=${keyword.id}`,
        })
    );

    useEffect(() => {
        if (ctxRef.current && Array.isArray(data) && data.length > 0) {
            const ctx = ctxRef.current.getContext('2d');
            window.myLine = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(x => x.createdAtFormatted),
                    datasets: [{
                        label: keyword.title,
                        backgroundColor: theme.palette.secondary.main,
                        borderColor: theme.palette.secondary.main,
                        data: data.map(x => x.rank),
                        fill: false,
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    scales: {
                        yAxes: [{
                            ticks: {
                                reverse: true,
                            }
                        }]
                    },
                }
            });

        }
    }, [data, keyword.title, theme.palette.secondary.main]);


    return (
        <canvas
            ref={ctxRef}
        />
    );
};

export default Dialog;