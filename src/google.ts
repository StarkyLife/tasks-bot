import { google } from 'googleapis';

export interface GoogleInstance {
    getSpreadSheetData(sheetId: string, range: string): Promise<string[][]>;
    appendDataToSpreadSheet(
        sheetId: string,
        range: string,
        values: Array<Array<string | undefined>>,
    ): Promise<void>;
}

export function getConnectedGoogleInstance(): GoogleInstance {
    const authClient = new google.auth.JWT({
        email: process.env.CLIENT_EMAIL,
        key: process.env.PRIVATE_KEY,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const { spreadsheets: spreadsheetsApiClient } = google.sheets({
        version: 'v4',
        auth: authClient,
    });

    return {
        async getSpreadSheetData(sheetId: string, range: string) {
            const response = await spreadsheetsApiClient.values.get({
                spreadsheetId: sheetId,
                range,
            });

            return response.data.values as string[][];
        },
        async appendDataToSpreadSheet(
            sheetId: string,
            range: string,
            values: Array<Array<string | undefined>>,
        ) {
            // append finds table and adds to new row after last filled
            await spreadsheetsApiClient.values.append({
                spreadsheetId: sheetId,
                range,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values,
                },
            });
        },
    };
}
