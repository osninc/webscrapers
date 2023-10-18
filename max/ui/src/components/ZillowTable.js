import { Button, ButtonGroup, Paper, Popover, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import React, { useState } from "react";
import { lotMatrix, statusMatrix, timeMatrix } from "../constants/matrix.js";
import { blue, cyan, green, yellow } from '@mui/material/colors';
import { ThirdPartyIcon } from "./ThirdPartyIcon.js";
import { DisplayNumber, USDollar, convertDateToLocal, sec2min } from "../functions/functions.js";

const columnColor = {
    "sold": yellow[200],
    "for sale": blue[200]
}

const ZillowHeader = props => {
    const { bg, columns } = props

    return (
        <>
            {[...Array(columns.cols)].map((_, i) => {
                return <TableCell key={i} colSpan={columns.colspan} align="center" sx={{ backgroundColor: bg[i] }}><strong>{columns.colText[i]}</strong></TableCell>
            })}
        </>
    )
}

const DataCell = props => {
    const {
        data: counts,
        lot,
        time,
        onClick,
        field,
        open,
        onMouseEnter,
        onMouseLeave
    } = props;
    const record = counts[lot][time]

    const calcDaysInTimeFrame = {
        "7 days": 7,
        "30 days": 30,
        "90 days": 90,
        "6 months": 180,
        "12 months": 360,
        "24 months": 720,
        "36 months": 1080
    }

    const typographyParams = {
        variant: "body2"
    }

    if (["count", "avgPrice", "avgPpa"].includes(field)) {


        const sold = record["sold"];
        const sale = record["for sale"]

        const lcLot = lot.toLowerCase();

        let commonParams = {
            "time": timeMatrix[time.toLowerCase()],
            lot: lcLot
        }
        if (lotMatrix[lcLot].minLotSize !== "")
            commonParams = { ...commonParams, "minLotSize": lotMatrix[lcLot].minLotSize.toString() }
        if (lotMatrix[lcLot].maxLotSize !== "")
            commonParams = { ...commonParams, "maxLotSize": lotMatrix[lcLot].maxLotSize.toString() }

        const buttonGroupParams = {
            disableElevation: true,
            variant: "text",
            size: "small",
            sx: { minWidth: 10 }
        }

        // clicked params
        let soldParams;
        let soldHtml = "N/A"
        let soldText = sold[field];
        let soldTextButton;
        let soldHover = "";

        if (sold) {
            soldParams = {
                ...commonParams,
                "status": statusMatrix["sold"],
                count: sold.count,
                mapCount: sold.mapCount
            }
            switch (field) {
                case "avgPrice":
                case "avgPpa":
                    soldText = USDollar.format(soldText);
                    soldTextButton = <Button href="#" onClick={(e) => onClick(e, soldParams)}>{soldText}</Button>
                    break;
                case "count":
                    soldTextButton = <ButtonGroup
                        {...buttonGroupParams}
                    >
                        <Button href="#" onClick={(e) => onClick(e, soldParams)}>{DisplayNumber.format(soldText)}</Button>
                        <Button href={sold.url} rel="noreferrer" target="_blank">
                            <ThirdPartyIcon site="zillow" size="xs" />
                        </Button>
                    </ButtonGroup>
                    break;
                default:
                    soldTextButton = soldText;
                    break;

            }
            soldHtml = soldTextButton;
        }

        let saleParams;
        let saleHtml = "N/A"
        let saleText = sale[field];
        let saleTextButton;
        let saleHover = "";

        if (sale) {
            saleParams = {
                ...commonParams,
                "status": statusMatrix["for sale"],
                count: sale.count,
                mapCount: sale.mapCount
            }
            switch (field) {
                case "avgPrice":
                case "avgPpa":
                    saleText = USDollar.format(saleText);
                    saleTextButton = <Button href="#" onClick={(e) => onClick(e, saleParams)}>{saleText}</Button>
                    break;
                case "count":
                    saleTextButton = <ButtonGroup
                        {...buttonGroupParams}
                    >
                        <Button href="#" onClick={(e) => onClick(e, saleParams)}>{DisplayNumber.format(saleText)}</Button>
                        <Button href={sale.url} rel="noreferrer" target="_blank">
                            <ThirdPartyIcon site="zillow" size="xs" />
                        </Button>
                    </ButtonGroup>
                    break;
                default:
                    saleTextButton = saleText;
                    break;
            }
            saleHtml = saleTextButton;
        }

        let moreSaleText = "";
        let moreSoldText = "";
        if (record["for sale"].numPrices >= 500)
            moreSaleText = <strong>DISCLAIMER: Results are limited to 500 records<br /></strong>;
        if (record["sold"].numPrices >= 500)
            moreSoldText = <strong>DISCLAIMER: Results are limited to 500 records<br /></strong>;
        switch (field) {
            case "avgPrice":
                saleHover = <Typography variant="caption">
                    {moreSaleText}
                    This value is the sum of all {record["for sale"].numPrices} available prices
                    divided by the Number of Listings that had a price listed<br />
                    {USDollar.format(record["for sale"].sumPrice)} / {record["for sale"].numPrices} = {saleText}
                </Typography>
                soldHover = <Typography variant="caption">
                    {moreSoldText}
                    This value is the sum of all {record["sold"].numPrices} available prices
                    divided by the Number of Sales that had a price listed<br />
                    {USDollar.format(record["sold"].sumPrice)} / {record["sold"].numPrices} = {soldText}
                </Typography>;
                break;
            case "avgPpa":
                saleHover = <Typography variant="caption">
                    {moreSaleText}
                    This value is the sum of each of the listing's individual price per acre
                    divided by  ({record["for sale"].numPrices}) listings<br />
                    sum(price/acre) / {record["for sale"].numPrices} = {saleText}
                </Typography>
                soldHover = <Typography variant="caption">
                    {moreSoldText}
                    This value is the sum of each of the sale's individual price per acre
                    divided by  ({record["sold"].numPrices}) sales <br />
                    sum(price/acre) / {record["sold"].numPrices} = {soldText}
                </Typography>;
                break;
            default:
                break;
        }
        return (
            <React.Fragment key={`${lot}${time}`}>
                <TableCell align="center" sx={{ backgroundColor: columnColor["for sale"] }}>
                    {(saleHover === "") ? saleHtml : (
                        <Typography
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => onMouseEnter(e, saleHover)}
                            onMouseLeave={(e) => onMouseLeave(e)}
                            {...typographyParams}
                        >
                            {saleHtml}
                        </Typography>
                    )}
                </TableCell>

                <TableCell align="center" sx={{ backgroundColor: columnColor["sold"] }}>
                    {(soldHover === "") ? soldHtml : (
                        <Typography
                            aria-owns={open ? 'mouse-over-popover' : undefined}
                            aria-haspopup="true"
                            onMouseEnter={(e) => onMouseEnter(e, soldHover)}
                            onMouseLeave={(e) => onMouseLeave(e)}
                            {...typographyParams}
                        >
                            {soldHtml}
                        </Typography>
                    )}
                </TableCell>

            </React.Fragment>
        )
    }
    else {
        // Possible hover
        let text = "";
        switch (field) {
            case "mos":
                text = <Typography variant="caption">
                    This value was calculated by Number of Active Listings ({record["for sale"].count})
                    divided by Number of Sales ({record["sold"].count}) multiplied by the number of days ({calcDaysInTimeFrame[time.toLowerCase()]})
                    divided by 30 days<br />
                    {record["for sale"].count} / {record["sold"].count} * {calcDaysInTimeFrame[time.toLowerCase()]} / 30 = {record[field]}
                </Typography>
                break;
            case "absorption":
                text = <Typography variant="caption">
                    This value is the percentage of the Number of Sales ({record["sold"].count})
                    divided by Number of Listings ({record["for sale"].count})<br />
                    {record["sold"].count} / {record["for sale"].count} * 100% = {record[field]}
                </Typography>
                break;
            case "ratio":
                text = <Typography variant="caption">
                    This value is the percentage of the Number of Listings ({record["for sale"].count})
                    divided by Number of Sales ({record["sold"].count})<br />
                    {record["for sale"].count} / {record["sold"].count} * 100% = {record[field]}
                </Typography>
                break;
            default:
                break;
        }
        return (
            <TableCell align="center" colSpan={2} sx={{ backgroundColor: columnColor["for sale"] }}>
                {(text === "") ? record[field] : (
                    <Typography
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={(e) => onMouseEnter(e, text)}
                        onMouseLeave={(e) => onMouseLeave(e)}
                        {...typographyParams}
                    >
                        {record[field]}
                    </Typography>
                )}
            </TableCell>
        )
    }
}

const ComingSoon = props => {
    const {
        area,
        header,
        date,
    } = props
    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center"><strong>{area} Vacant Land</strong><br />
                            <Typography variant="caption">
                                Data from {date}
                            </Typography>
                        </TableCell>
                    </TableRow>
                    <TableRow sx={{ backgroundColor: header.color }}>
                        <TableCell align="center"><strong>{header.text}</strong></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell align="center">Coming soon!</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export const ZillowTable = ({ value, data, onClick, area, date, source, loadTime }) => {
    const newDate = convertDateToLocal(date)
    const newLoadTime = (loadTime > 0) ? `(${sec2min(loadTime)})` : "";
    const commonColText = ["Listed", "Sold"]
    const commonBgColor = [columnColor["for sale"], columnColor["sold"]]
    const tableHeader = {
        0: {
            text: "Sales & Listing Counts",
            color: yellow[500],
            columns: {
                cols: 2,
                colspan: 1,
                colText: commonColText,
            },
            comingSoon: false,
            dataField: "count"
        },
        1: {
            text: "Average Prices for Sold & Listed Land",
            color: yellow[500],
            columns: {
                cols: 2,
                colspan: 1,
                colText: commonColText,
            },
            comingSoon: false,
            dataField: "avgPrice"
        },
        2: {
            text: "List/Sale Ratio",
            color: cyan[200],
            columns: {
                cols: 1,
                colspan: 2,
                colText: ["Ratio L/S"],
            },
            comingSoon: false,
            dataField: "ratio"
        },
        3: {
            text: "PPA: Price/Per Acre",
            color: cyan[200],
            columns: {
                cols: 2,
                colspan: 1,
                colText: commonColText,
            },
            comingSoon: false,
            dataField: "avgPpa"
        },
        4: {
            text: "Months of Supply",
            color: cyan[200],
            columns: {
                cols: 1,
                colspan: 2,
                colText: ["MoS"],
            },
            comingSoon: false,
            dataField: "mos"
        },
        5: {
            text: "DOM Days on Market",
            color: green["A400"],
            columns: {
                cols: 2,
                colspan: 1,
                colText: commonColText,
            },
            comingSoon: true,
            dataField: "count"
        },
        6: {
            text: "Realtors",
            color: green["A400"],
            columns: {
                cols: 2,
                colspan: 1,
                colText: commonColText,
            },
            comingSoon: true,
            dataField: "count"
        },
        7: {
            text: "Absorption Rate",
            color: cyan[200],
            columns: {
                cols: 1,
                colspan: 2,
                colText: ["Absorption"],
            },
            comingSoon: false,
            dataField: "absorption"
        }
    }

    const colSpan = (value === 0) ? 15 : 15;

    // For hovering
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverText, setPopoverText] = useState("")
    const handlePopoverOpen = (event, text) => {
        setPopoverText(text)
        setAnchorEl(event.currentTarget);
    };

    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    // calculate columns loop
    const colLoop = [...Array(7)]
    return (
        ((value === 6) || (source !== "zillow")) ? (
            <ComingSoon area={area} header={tableHeader[value]} date={newDate} />
        ) : (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>&nbsp;</TableCell>
                            <TableCell colSpan={colSpan} align="center"><strong>{area} Vacant Land</strong><br />
                                <Typography variant="caption">
                                        Data from {newDate} {(newLoadTime)}
                                </Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow sx={{ backgroundColor: tableHeader[value].color }}>
                            <TableCell>&nbsp;</TableCell>
                            <TableCell colSpan={colSpan} align="center"><strong>{tableHeader[value].text}</strong></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>&nbsp;</TableCell>
                            <TableCell>&nbsp;</TableCell>
                            {Object.keys(timeMatrix).map(time => (
                                (time !== "") &&
                                (time) &&
                                <TableCell key={time} align="center" colSpan={2}><strong>{time}</strong></TableCell>
                            ))}
                        </TableRow>
                        {(!tableHeader[value].comingSoon) && (
                            <TableRow>
                                <TableCell><strong>PARCELS</strong></TableCell>
                                <TableCell><strong>ACRES</strong></TableCell>
                                {colLoop.map((_, i) => (
                                    <ZillowHeader
                                        key={i}
                                        bg={commonBgColor}
                                        columns={tableHeader[value].columns}
                                    />
                                ))}
                            </TableRow>
                        )}
                    </TableHead>
                    {(!tableHeader[value].comingSoon) ? (
                        <TableBody>
                            {Object.keys(lotMatrix).map(lot => (
                                <TableRow
                                    key={lot}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell align="center"><Typography variant="caption">TBD</Typography></TableCell>
                                    <TableCell align="center">{lot}</TableCell>
                                    {Object.keys(timeMatrix).map(time => (
                                        <DataCell
                                            key={`${time}${lot}${tableHeader[value].dataField}`}
                                            data={data}
                                            lot={lot}
                                            time={time}
                                            field={tableHeader[value].dataField}
                                            onClick={(e, p) => {
                                                onClick(e, p)
                                            }}
                                            open={open}
                                            anchorEl={anchorEl}
                                            onMouseEnter={(e, text) => handlePopoverOpen(e, text)}
                                            onMouseLeave={handlePopoverClose}
                                        />
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    ) : (
                        <TableBody>
                            <TableRow>
                                <TableCell colSpan={colSpan} align="center">Coming soon!</TableCell>
                            </TableRow>
                        </TableBody>
                    )}

                </Table>
                <Popover
                    id="mouse-over-popover"
                    sx={{
                        pointerEvents: 'none',
                    }}
                    open={open}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'left',
                    }}
                    onClose={handlePopoverClose}
                    disableRestoreFocus
                >
                    <Typography sx={{ p: 2 }}> {popoverText}</Typography>
                </Popover>
            </TableContainer>
        )
    )
}
