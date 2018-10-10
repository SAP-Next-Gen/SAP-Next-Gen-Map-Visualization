import React, { Component } from 'react';
import { Form, FormGroup, Label, CustomInput } from 'reactstrap';
import XLSX from 'xlsx';

class HeaderCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entries: [],
        };
    }

    handleInputFileChange(files) {
        if (files.length === 0) {
            return
        }
        let reader = new FileReader();
        let self = this;
        reader.onloadend = function(e) {
            self.parseXlsTable(e.target.result);
        };
        reader.readAsArrayBuffer(files[0]);
    }

    parseXlsTable(table) {
        let workbook = XLSX.read(table, {type: 'array'});
        let first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
        let data = XLSX.utils.sheet_to_json(first_worksheet, {range: 4});
        data.forEach(entry => {
            this.fetchLocation(entry);
        });
    }

    fetchLocation(entry) {
        fetch("https://api.mapbox.com/geocoding/v5/mapbox.places/" + entry.City + ".json?access_token=" + process.env.REACT_APP_MAPBOX_KEY)
            .then(data => data.json())
            .then(data => {
                entry.coordinates = data.features[0].geometry.coordinates;
                this.setState((state) => {
                    return {entries: state.entries.concat(entry)};
                });
            })
            .catch(e => {
                console.log("Couldn't find location for " + entry.Name + " in " + entry.City)
            })
    }

    render() { 
        return (
            <div className="HeaderCard">
                <Form>
                    <FormGroup>
                        <Label for="exampleCustomFileBrowser">File Browser with Custom Label</Label>
                        <CustomInput
                            type="file"
                            label="Yo, pick a file!"
                            onChange={ e => this.handleInputFileChange(e.target.files) }
                        />
                    </FormGroup>
                </Form>
            </div>
        );
    }
}

export default HeaderCard;
