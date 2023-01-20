import { Entry } from './types';
const fs = require('fs');

export default class Utils {

    /**
    * Takes the path to a csv file as input and return its representation as array of Entries
    * @param path string of the path to the csv file
    * @return array of the entries
    */
    static parseCsv(path : string) : Entry[] {

        // Read the CSV file
        const file = fs.readFileSync(path, "utf8");
      
        // Split the file into lines
        const lines = file.split("\n");
      
        // Split each line into values
        const values = lines.map((line : any) => line.split(","));
      
        // remove the first line (header)
        values.shift();
      
        // create an Entry for each line
        // remove \r from the balance
        const entries : Entry[] = values.map((values : any) => {
      
          if (isNaN(values[1])) {
              throw new Error("Balance must be a number");
          }
      
          return {
              username: values[0],
              balance: BigInt(values[1].replace("\r", "")),
          };
      });
      
          return entries;
      }


    /**
    * Transform a username into its utf8 bytes representation, convert it to BigInt and return it
    * @param username the string of the username to be converted
    * @return BigInt representation of the username
    */
    static parseUsernameToBigInt(username:string) : bigint {

        const encoder = new TextEncoder();
        const utf8bytes = encoder.encode(username); 
        
        const bigIntNumber = BigInt("0x" + utf8bytes.reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), ''));

        return bigIntNumber;
    }

    /**
    * Transform a BigInt into its utf8 bytes representation, convert it to a username and return it.
    * @param bigIntNumber the bigInt to be converted
    * @return string representation of the username
    */
    static parseBigIntToUsername(bigIntNumber: bigint) : string {
        const hexString = bigIntNumber.toString(16);
        const hexArray = hexString.match(/.{2}/g) || [];
        const byteArray = hexArray.map(byte => parseInt(byte, 16));
    
        const decoder = new TextDecoder();
        return decoder.decode(Uint8Array.from(byteArray));
    }
}