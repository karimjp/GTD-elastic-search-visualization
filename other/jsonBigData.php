 <?php ini_set("memory_limit","-1");
 ini_set('max_execution_time', 300);?>
 <?php
/* Author: Karim Jana
 * Description: Converts CSV to JSON format.  Echoes dynamically a JSON array.
 * Created: 4/24/2013
 * Last Modified: 4/24/2013
 */


 header('Content-Type: application/json');

 // Set your CSV feed
$feed = "gtd_91to11_1012dist.csv";

$keys= array();
$rowArray= array();
$data=array();
$assocArrayList = array();
$row = 0;
$dataArray = array();
$f=fopen("data1.json", 'w');

if (($handle = fopen($feed, "r")) !== FALSE) {
    while (($data = fgetcsv($handle,50000, ",")) !== FALSE) {
		 // array to store fields value per row
        $num = count($data); // number of fields
     
        $row++; //count row
		
		//for every field(column) in the csv
        for ($column=0; $column < $num; $column++) {
			
			//store headers as keys
			if($row ==1)
			{	
			//print_r($data[$column]);echo"    ";
				//add headers as keys in the key[]
				array_push($keys, $data[$column]);
				
			}
			else  // if we are reading field values below the header(row = 1)...
			{
			//store all the columns (fields) from read row during 
			//iteration in $dataArray
		
			
			array_push($dataArray, $data[$column]);// row with fields values 
			
			
				
					if($column == $num-1){
					
				$associative = array_combine($keys, $dataArray);
					if(sizeof($keys) != sizeof($associative)){
						print_r($keys);
						print_r($dataArray);
						
						continue;
					}
				//print_r($associative);
				//echo json_encode($associative);
				
				$string = json_encode($associative);
				//echo $string;
				fwrite($f, $string);
				$dataArray = array();
				}
			}
			
        }
	
    }
	
	
    fclose($handle);
	fclose($f);
}

//	print_r($keys);
	//echo count($keys);
	//print_r($dataArray);
	//echo count($dataArray);
	//print_r($rowArray);
	//echo count($rowArray);

// Print it out as JSON
//echo json_encode($newArray);  //feed associative array
 //[{"ds_name": "ds1", "priority": "high", "ds_col_name": "dscol1", 
 //"level": "routine", "owner": "org3", "type": "type7", 
 //"location": "loc4", "geotag": "place5"}, 
 //{"ds_name": "ds2", "priority": "low", "ds_col_name": "dscol1", 
 //"level": "routine", "owner": "org3", "type": "type30", 
 //"location": "loc5", "geotag": "place5"}]
?>

 

 

