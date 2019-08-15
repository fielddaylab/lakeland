# usda
## Logging Events
Each log is sent with a number of fields required by [simplelog](https://github.com/fielddaylab/simplelog). Simple log allows for a custom field called event_data_complex along with its category enumerator:
  event_custom: category enumerator
  event_data_complex: JSON.stringify(log_data)
Each log_data is a JSON object for that specific category as defined below.

#### Change Log
Versions:
1. Alpha
2. Original Version
3. Change itemusechange: remove mark, add prev_mark
4. Remove gzipping.
5. Restructure speed logs. Old version only logged manual speed changes. New version logs automatic and manual speed changes with a boolean "manual" as 1 if manually changed and 0 otherwise.
6. Add num milk/food/poop produced into the gamestate log

### Event Categories
0. [gamestate](#gamestate)
1. [startgame](#startgame)
1. [checkpoint](#checkpoint)
1. [selecttile](#selecttile)
1. [selectfarmbit](#selectfarmbit)
1. [selectitem](#selectitem)
1. [selectbuy](#selectbuy)
1. [buy](#buy)
1. [cancelbuy](#cancelbuy)
1. [roadbuilds](#roadbuilds)
1. [tileuseselect](#tileuseselect)
1. [itemuseselect](#itemuseselect)
1. [togglenutrition](#togglenutrition)
1. [toggleshop](#toggleshop)
1. [toggleachievements](#toggleachievements)
1. [skiptutorial](#skiptutorial)
1. [speed](#speed)
1. [achievement](#achievement)
1. [farmbitdeath](#farmbitdeath)
1. [blurb](#blurb)
1. [click](#click)
1. [rainstopped](#rainstopped)
1. [history](#history)
1. [endgame](#endgame)

### Enumerators and Constants
1. [Event Categories](#EventCategories)
1. [Emotes](#Emotes)
1. [Buys](#Buys)
1. [Names](#Names)
1. [Speed](#SpeedConst)
1. [Achievements](#Achievements)
1. [Tutorials](#Tutorials)
1. [Thing Type](#Thing_Type)
1. [Inspector Content](#InspectorContent)
1. [Text Type](#TextType)
1. [Advisor Type](#AdvisorType)
1. [Tile Type](#TileStates)
1. [Tile Type](#TileType)
1. [Job Type](#JobType)
1. [Item Type](#ItemType)
1. [Job State](#JobState)
1. [Farmbit State](#FarmbitState)
1. [Farmbit Need](#FarmbitNeed)
1. [Direction](#Direction)
1. [Mark](#Mark)

### Data Structures
1. [Camera Move](#CameraMove)
1. [Data Short](#DataShort)
1. [Data Matrices](#DataMatrices)

### Built With
1. [Browserify, Pako](#BuiltWith)

<a name="gamestate"/>

## Event Categories
#### gamestate (index=0)
| Key | Value | Description |
| --- | --- | --- |
| tiles | uint8_tile_array().join() | Tile [data matrix](#DataMatrices).   |
| farmbits | uint8_farmbit_array().join() | Farmbit [data matrix](#DataMatrices).   |
| items | uint8_item_array().join() | Item [data matrix](#DataMatrices).  |
| money | gg.money | current money  |
| speed | gg.speed |  current game speed (see [Speed](#SpeedConst)) |
| achievements | achievements |A boolean array of whether the player has gotten the [achievement](#Achievements) at that index.   |
| num_checkpoints_completed | get_num_checkpoints_completed() | Number of tutorials began + number of tutorial ended. Includes tutorials skipped.   |
| raining | gg.b.raining | Boolean - currently raining or not.  |
| curr_selection_type | gg.inspector.detailed_type |Current selection [inspector content](#InspectorContent) index. (Note that because the game currently (as of 7/25) logs gamestate only after buys, this will always be the type of tile.)  |
| curr_selection_data | detailed_data() | SelectFarmbit/SelectItem/SelectTile data, depending on the curr_selection_type.  |
| camera_center | prev_center_txty | Tile that the game is currently centered on.  |
| gametime | time | Metric to count speed-adjusted time. Based on number of ticks. |
| client_time | now | current client time  |
| num_food_produced | num_food_produced | total number of food produced (not bought) since the start of the game |
| num_poop_produced | num_poop_produced | total number of poop produced (not bought) since the start of the game |
| num_milk_produced | num_milk_produced | total number of milk produced (not bought) since the start of the game |

<a name="startgame"/>

#### startgame (index=1)
| Key | Value | Description |
| --- | --- | --- |
| tile_states | tile_states | 2500 element array of tile state indices.  |
| tile_nutritions | tile_nutritions |   2500 element array of tile nutritions on a scale 0-255. | 

<a name="checkpoint"/>

#### checkpoint (index=2)
Checkpoints are the google analytics events. As of 8/14/19 these are always tutorial begins and ends. See [tutorials](#Tutorials).

| Key | Value | Description |
| --- | --- | --- |
| event_category | arguments[2]  | Always (as of 8/14/19) begin or end |
| event_label  |  arguments[2]  | Tutorial name. For example, the name of the tutorial that teaches the player how to build a house is called "build_a_house" |
| event_type  | arguments[1]  | Always (as of 8/14/19) tutorial |
| blurb_history | flush_blurb_history(now) |  List of client time relative to now for each blurb popup. (Blurbs are now logged here instead of the [blurb](#blurb) event.) | 
| client_time | now | current client time  |

<a name="selecttile"/>

#### selecttile (index=3)
Note selections may happen automatically by advisors in the tutorials.

| Key | Value | Description |
| --- | --- | --- |
| tile | tile_data_short(t) | See [Data Short](#DataShort).  |
| marks | t.marks | Tile [mark indices](#Mark).  | 

<a name="selectfarmbit"/>

#### selectfarmbit (index=4)
Note selections may happen automatically by advisors in the tutorials.

| Key | Value | Description |
| --- | --- | --- |
| farmbit | farmbit_data_short(f) | See [Data Short](#DataShort).  | 

<a name="selectitem"/>

#### selectitem (index=5)
Note selections may happen automatically by advisors in the tutorials.

| Key | Value | Description |
| --- | --- | --- |
| item | item_data_short(it) | See [Data Short](#DataShort).   |
| mark | it.mark | Item [mark index](#Mark).  | 

<a name="selectbuy"/>

#### selectbuy (index=6)
| Key | Value | Description |
| --- | --- | --- |
| buy | buy | [Buy index](#Buys).   |
| cost | gg.shop.buy_cost(buy) | Cost of buy  |
| curr_money | gg.money | Current money  |
| success | gg.money>=gg.shop.buy_cost(buy) | Boolean. Whether the buy can be selected or not. (Cannot select a buy that cannot be paid for.)  |

<a name="buy"/>

#### buy (index=7)
Note: Buys are logged whether the buy was a success or not.

| Key | Value | Description |
| --- | --- | --- |
| buy | gg.shop.selected_buy | [Buy index](#Buys).  |
| tile | tile_data_short(gg.b.hover_t) | [Data Short](#DataShort) for the tile the buy will be placed on.   |
| success | gg.b.placement_valid(gg.b.hover_tgg.shop.selected_buy) | Boolean. Whether the buy can be put on the tile. If not, buy fails.  |
| buy_hovers | flush_buy_hovers(now) |  List of tile [Data Short](#DataShort) appended with client time before now for each hovered tile since either selectbuy log or the previous buy log. | 
| client_time | now | current client time  |


<a name="cancelbuy"/>

#### cancelbuy (index=8)
| Key | Value | Description |
| --- | --- | --- |
| selected_buy | buy | [Buy index](#Buys).  |
| cost | gg.shop.buy_cost(buy) | Cost of buy.  |
| curr_money | gg.money | Current money.  |
| buy_hovers | flush_buy_hovers(now) |  List of tile [Data Short](#DataShort) appended with client time before now for each hovered tile since either selectbuy log or the previous buy log. | 
| client_time | now | current client time  |

<a name="roadbuilds"/>

#### roadbuilds (index=9)
| Key | Value | Description |
| --- | --- | --- |
| road_builds | flush_road_hovers(now) |  List of tile [Data Short](#DataShort) appended with client time before now for each tile a road was built on. | 
| client_time | now | current client time  |

<a name="tileuseselect"/>

#### tileuseselect (index=10)
Note that this log occurs even when the player selects the current use/mark, i.e. produced corn 1 sell->sell.

| Key | Value | Description |
| --- | --- | --- |
| tile | tile_data_short(t) | See [Data Short](#DataShort).  |
| marks | t.marks |  Tile [mark indices](#Mark). | 

<a name="itemuseselect"/>

#### itemuseselect (index=11)
Note that this log occurs even when the player selects the current use/mark, i.e.corn sell->sell.

| Key | Value | Description |
| --- | --- | --- |
| item | item_data_short(it) | See [Data Short](#DataShort).  |
| prev_mark | self.prev_item_use | Item's previous [mark index](#Mark).  |

<a name="togglenutrition"/>

#### togglenutrition (index=12)
| Key | Value | Description |
| --- | --- | --- |
| to_state | gg.b.nutrition_view | 1 if nutrition view is being turned on, 0 if turned off.  |
| tile_nutritions | nutrition_array() |  2500 element array of tile nutritions on a scale 0-255. | 

<a name="toggleshop"/>

#### toggleshop (index=13)
| Key | Value | Description |
| --- | --- | --- |
| shop_open | gg.shop.open | 1 if the shop view is being opened, 0 if closed.  | 

<a name="toggleachievements"/>

#### toggleachievements (index=14)
| Key | Value | Description |
| --- | --- | --- |
| achievements_open | gg.achievements.open | 1 if the achievement view is being opened, 0 if closed.  | 


<a name="skiptutorial"/>

#### skiptutorial (index=15)
Note: Tutorial checkpoints will be logged regardless of if the tutorial is skipped or not.

| Key | Value | Description |
| --- | --- | --- |
|(none)  |   | Event itself indicates that the player skipped a tutorial (the tutorial skipped is the last tutorial event logged). |

<a name="speed"/>

#### speed (index=16)
| Key | Value | Description |
| --- | --- | --- |
| cur_speed | gg.speed | To [speed](#SpeedConst) index.  |
| prev_speed | speed | From [speed](#SpeedConst) index.  | 
| manual | manual_speed_bool | bool: 1 if speed was manually changed, 0 if not | 

<a name="achievement"/>

#### achievement (index=17)
| Key | Value | Description |
| --- | --- | --- |
| achievement | i | [Achievement](#Achievements) index.  | 

<a name="farmbitdeath"/>

#### farmbitdeath (index=18)
| Key | Value | Description |
| --- | --- | --- |
| farmbit | farmbit_data_short(f) |  See [Data Short](#DataShort). |
| grave | tile_data_short(f.home) | Tile data short of dead farmbit's home.  | 

<a name="blurb"/>

#### blurb (index=19)
(not currently implemented. See blurb_history under [checkpoint](#checkpoint).)
Note: a blurb is an utterance from an advisor.

| Key | Value | Description |
| --- | --- | --- |
|(none)  |   | Event itself indicates that the player clicked to the next blurb in a tutorial etc. (the tutorial itself is the last tutorial event logged). |


<a name="click"/>
(not currently implemented)

#### click (index=20)
| Key | Value | Description |
| --- | --- | --- |
|(not currently implemented)  |   |  |


<a name="rainstopped"/>

#### rainstopped (index=21)
| Key | Value | Description |
| --- | --- | --- |
|(none)  |   | Log itself indicates that it was raining and the raining has now stopped. |

<a name="history"/>

#### history (index=22)
| Key | Value | Description |
| --- | --- | --- |
| client_time | now | current client time  |
| camera_history | flush_camera_history(now) | List of [camera moves](#CameraMove) since last history log. |
| emote_history | flush_emote_history(now) | List of 10 element sublists [[farmbit](#DataShort), [emote index](#Emotes), time before client_time (negative number)] emotes since last history log.  | 

<a name="endgame"/>

#### endgame (index=23)
| Key | Value | Description |
| --- | --- | --- |
|(none)  |   | Log itself indicates the player has left the game page. Seperate history and gamestate logs are sent.  |


## Enumerators and Constants

<a name="EventCategories"/>

#### Event Categories 
| Index | Name | Description |
| --- | --- | --- | 
|0| gamestate| |
|1| startgame| |
|2| checkpoint| |
|3| selecttile| |
|4| selectfarmbit| |
|5| selectitem| |
|6| selectbuy| |
|7| buy| |
|8| cancelbuy| |
|9| roadbuilds| |
|10| tileuseselect| |
|11| itemuseselect| |
|12| togglenutrition| |
|13| toggleshop| |
|14| toggleachievements| |
|15| skiptutorial| |
|16| speed| |
|17| achievement| |
|18| farmbitdeath| |
|19| blurb| |
|20| click| |
|21| rainstopped| |
|22| history| |
|23| endgame| |


<a name="Emotes"/>

#### Emotes 
| Index | Name | Description |
| --- | --- | --- | 
|0| fullness_motivated_txt | "i'm hungry" |
|1| fullness_desperate_txt | "i need food" |
|2| energy_desperate_txt | "i need a nap!" |
|3| joy_motivated_txt | "i want to play in the water" |
|4| joy_desperate_txt | "i'm so sad" |
|5| puke_txt | "🤮" |
|6| yum_txt | "😋" |
|7| tired_txt | "😴" |
|8| happy_txt | "🙂" |
|9| swim_txt | "swim" |
|10| sale_txt | "sale" |

<a name="Buys"/>

#### Buys 
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| home | |
|2| food | |
|3| farm | |
|4| fertilizer | |
|5| livestock | |
|6| skimmer | |
|7| sign | |
|8| road  | |

<a name="Names"/>

#### Names 
| Index | Name | Description |
| --- | --- | --- | 
| 0 | Peter | |
| 1 | Paul | |
| 2 | Mary | |
| 3 | John | |
| 4 | George | |
| 5 | Ringo | |
| 6 | Yoko | |
| 7 | Stevie | |
| 8 | Saanvi | |
| 9 | Nethra | |
| 10 | Meha | |
| 11 | Sidney | |
| 12 | Lucy | |
| 13 | Belden | |
| 14 | Henry | |
| 15 | Alejandro | |
| 16 | Victor | |
| 17 | Richard | |

<a name="SpeedConst"/>

#### Speed 
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| pause | x0 speed |
|2| play | x1 speed |
|3| fast | x4 speed |
|4| vfast | x16 speed |

<a name="Achievements"/>

#### Achievements 
Achievements is stored as a 16 element boolean array, true if the achievement has been gotten.

| Index | Name | Description |
| --- | --- | --- | 
|0| exist | get a visitor. |
|1| group | 3 workers |
|2| town | a small community |
|3| city | 10 townmembers |
|4| farmer | own a farm! |
|5| farmers | get three farms |
|6| farmtown | 5 farms! |
|7| megafarm | 10 farm industry |
|8| paycheck | $500 |
|9| thousandair | $1000 |
|10| stability | $5000 |
|11| riches | $10000 |
|12| bloom | algae destroys one tile |
|13| bigbloom | algae spreads to 3 tiles |
|14| hugebloom | you have an algae problem |
|15| massivebloom | a whole lake destroyed"|


<a name="Tutorials"/>

#### Tutorials 
There are 26 begins and 26 ends. In the constants for the feature extractor, these tutorials are assigned indices alphabetically:

| Index | Name | Description |
| --- | --- | --- | 
|0| another_death| |
|1| another_member| |
|2| bloom| |
|3| build_a_farm| tutorial 3 |
|4| build_a_house| tutorial 1 |
|5| buy_fertilizer| tutorial 6 |
|6| buy_food| tutorial 2|
|7| buy_livestock //last tutorial that all players will encounter (we think)| |
|8| death| |
|9| end_life| |
|10| extra_life| |
|11| final_death| |
|12| flooded_fertilizer| |
|13| gross| |
|14| gross_again| |
|15| livestock| tutorial 7 |
|16| long_travel| |
|17| low_nutrients| |
|18| mass_sadness| |
|19| poop| tutorial 8 |
|20| rain| |
|21| sell_food| tutorial 5 |
|22| successful_harvest| |
|23| timewarp| tutorial 4 |
|24| unattended_farm| |
|25| unused_fertilizer| |


<a name="Thing_Type"/>

#### Thing_Type 
| Index | Name | Description |
| --- | --- | --- | 
|0| null | Default |
|1| tile | Gameboard tiles. Has state, type, and an array of 4 marks. Abbreviated as "t".|
|2| item | Of type water, food, fertilizer, poop, milk. Has mark attribute. Abbreviated as "it".|
|3| farmbit | Has name, state, job type, job state. Abbreviated as "f". |

<a name="InspectorContent"/>

#### Inspector Content
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| farmbit | |
|2| item | |
|3| tile | |

<a name="TextType"/>

#### Text Type
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| observe | |
|2| dismiss | |
|3| direct | |

<a name="AdvisorType"/>

#### Advisor Type
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| mayor | |
|2| business | |
|3| farmer | |

<a name="TileStates"/>

#### Tile States
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| home_vacant | |
|2| home_occupied | |
|3| land_d0 | |
|4| land_d1 | |
|5| land_d2 | |
|6| farm_unplanted | |
|7| farm_planted | |
|8| farm_grown | |
|9| livestock_eating | |
|10| livestock_digesting | |
|11| livestock_milkable | |

<a name="TileType"/>

#### Tile Type
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| land | |
|2| rock | |
|3| grave | |
|4| sign | |
|5| lake | |
|6| shore | |
|7| forest | |
|8| home | |
|9| farm | |
|10| livestock | |
|11| road | |

<a name="JobType"/>

#### Job Type
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| idle | |
|2| wait | |
|3| eat | |
|4| sleep | |
|5| play | |
|6| plant | |
|7| harvest | |
|8| feed | |
|9| fertilize | |
|10| milk | |
|11| export | |

<a name="ItemType"/>

#### Item Type
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| water | |
|2| food | |
|3| poop | |
|4| fertilizer | |
|5| milk | |

<a name="JobState"/>

#### Job State
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| get | |
|2| seek | |
|3| act | |

<a name="FarmbitState"/>

#### Farmbit State
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| dire | |
|2| desperate | |
|3| motivated | |

<a name="FarmbitNeed"/>

#### Farmbit Need
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| fullness | |
|2| energy | |
|3| joy | |
|4| fulfillment | |

<a name="Direction"/>

#### Direction
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| r | |
|2| dr | |
|3| d | |
|4| dl | |
|5| l | |
|6| ul | |
|7| u | |
|8| ur | |

<a name="Mark"/>

#### Mark
Each tile contains an array of 4 marks and each item contains one mark.

| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| use | Default mark.|
|2| sell | |
|3| feed | |


## Data Structures
<a name="CameraMove"/>

#### Camera Move 
| Index | Name | Description |
| --- | --- | --- | 
|0| t.tx | center tile tx |
|1| t.ty  |center tile ty |
|2| auto | boolean for whether the move happened automatically (1) or not (0)|
|3| time-now | time before client_time that the move happened (negative number) |
<a name="DataShort"/>

#### Data Short 
These are each uint8 vectors. They are as follows:
1. Tile

| Index | Name | Description |
| --- | --- | --- | 
|0| val/nutrition_max*255 | 0-255 representing a tile type dependent value if exists, 0 otherwise. For example, this refers to growth for farms and remains 0 for homes.|
|1| nutrition/nutrition_max*255 | 0-255 representing nutrition of each tile. |
|2| og_type | Original [tile type](#TileType) index. |
|3| type | Current [tile type](#TileType) index. |
|4| tx | Tile grid x coordinate. *(Not included in data matrix)* |
|5| ty | Tile grid y coordinate. *(Not included in data matrix)* |
2. Farmbit

| Index | Name | Description |
| --- | --- | --- | 
|0| tile.tx | Tile grid x coordinate of associated tile. |
|1| tile.ty | Tile grid y coordinate of associated tile.|
|2| name | Farmbit [name](#Names) index. |
|3| job_state | Current [job state](#JobState) index, (null, get, seek, act). |
|4| job_type | Current [job type](#JobType) index. |
|5| fullness/max_fullness*255 | Measure of hunger from 0-255 |
|6| energy/max_energy*255 |Measure of energy from 0-255 |
|7| joy/max_joy*255 | Measure of joy from 0-255|
|8| fulfillment/max_fulfillment*255 | Measure of fulfillment from 0-255 |
3. Item

| Index | Name | Description |
| --- | --- | --- | 
|0| tile.tx |Tile grid x coordinate of associated tile. |
|1| tile.ty |Tile grid y coordinate of associated tile. |
|2| type | Item [type](#ItemType) index.|
|3| mark | Item [mark](#Mark) index.|

<a name="DataMatrices"/>

#### Data Matrices 
The gamestate log contains uint8 arrays of all tiles, farmbits, and items. 
These arrays are concatenated data_short arrays, and can be thought of as matrices where the row (farmbit/tile/item instance)
is index//vars_per_entry and the column is index%vars_per_entry.

Note: The gamestate log of all tiles does not contain tile tx,ty. Row of the tile is derivable from 50*ty+tx.

<a name="BuiltWith"/>

## Built With
The logging script (logging.js) was bundled (to bundle.js) using Browserify with Pako.
NOTE: These are removed in v4.

* [Browserify](http://browserify.org) - Allows the use of Pako in the browser.
* [Pako](http://github.com/nodeca/pako) - zlib port to javascript used to gzip gamestates.
