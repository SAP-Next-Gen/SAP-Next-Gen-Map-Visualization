import React, { Component } from 'react';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import XLSX from 'xlsx';
import PropTypes from 'prop-types';
import { sleep } from '../util';


class HeaderCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            hasError: false,
        };
    }

    handleInputFileChanged = (files) => {
        if (files.length === 0) {
            return
        }
        let reader = new FileReader();
        reader.onloadend = (e => this.updateEntries(e.target.result));
        reader.readAsArrayBuffer(files[0]);
    }

    updateEntries = async (rawXlsTable) => {
        this.setState({
            isLoading: true,
        });
        let parsedTable = this.parseXlsTable(rawXlsTable);
        //parsedTable = parsedTable.slice(0, 20);
        let filteredTable = this.filterTransform(parsedTable);
        let tableWithLocations = await this.fetchAllLocations(filteredTable);
        this.props.callbackEntriesUpdated(tableWithLocations);
        this.setState({
            isLoading: false,
        });
    }

    parseXlsTable = (table) => {
        let workbook = XLSX.read(table, {type: 'array'});
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return XLSX.utils.sheet_to_json(first_worksheet, {range: 4});
    }

    filterTransform = (entries) => {
        function Entry(id, name, city, country, role, partner, chapter, lab, long, lat) {
            this.id = id;
            this.name = name;
            this.city = city;
            this.country = country;
            this.role = role;
            this.partner = partner;
            this.chapter = chapter;
            this.lab = lab;
            this.long = long;
            this.lat = lat;
        }

        entries = entries.map(x => {
            return new Entry(
                x["Account ID"],
                x["Name"],
                x["City"],
                x["Country"],
                x["Role"],
                x["UA Relationship"] === "Yes" ? true : false,
                x["SAP Next-Gen Chapter"] === "Yes" ? true : false,
                (x["Next-Gen lab/hub"] === "Next-Gen lab" || x["Next-Gen lab/hub"] === "Next-Gen hub") ? true : false,
                0,
                0,
            );
        });
        entries = entries.filter(x => x.role === "Educational Institution");

        return entries;
    }

    fetchAllLocations = async (entries) => {
        let entries_w_location = [];
        for(let entry of entries) {
            let coordinates = await this.fetchLocation(entry.name + " " + entry.city);
            entry.long = coordinates[0];
            entry.lat = coordinates[1];
            entries_w_location = entries_w_location.concat(entry);
            // await next request for rate limit reasons
            await sleep(50);
        };

        return entries_w_location;
    }

    fetchLocation = async (searchText) => {
        let response = await fetch(
            "https://api.mapbox.com/geocoding/v5/mapbox.places/" +
            searchText.replace(/\(.*?\)|\)|\(|\/|\./g, " ") +
            ".json?limit=1&access_token=" +
            process.env.REACT_APP_MAPBOX_KEY
        );
        let data = await response.json();

        try {
            return data.features[0].geometry.coordinates;
        } catch (e) {
            console.log("ERROR: " + searchText);
            return [0, 0];
        }
    }

    render() { 
        return (
            <div className="HeaderCard">
                <Form>
                    <FormGroup>
                        <Label for="exampleCustomFileBrowser">File Browser with Custom Label</Label>
                        <CustomInput
                            id="fileInput"
                            type="file"
                            label="Yo, pick a file!"
                            onChange={ e => this.handleInputFileChanged(e.target.files) }
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

HeaderCard.propTypes = {
    callbackEntriesUpdated: PropTypes.func.isRequired,
}

export default HeaderCard;
