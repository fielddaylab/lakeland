# usda
## Logging Events

### Event Categories
0. [gamestate](#gamestate)
1. [startgame](#startgame)
2. [checkpoint](#checkpoint)
3. [selecttile](#selecttile)
4. [selectfarmbit](#selectfarmbit)
5. [selectitem](#selectitem)
6. [selectbuy](#selectbuy)
7. [buy](#buy)
8. [cancelbuy](#cancelbuy)
9. [tileuseselect](#tileuseselect)
10. [itemuseselect](#itemuseselect)
11. [togglenutrition](#togglenutrition)
12. [toggleshop](#toggleshop)
13. [toggleachievements](#toggleachievements)
14. [skiptutorial](#skiptutorial)
15. [speed](#speed)
16. [achievement](#achievement)
17. [farmbitdeath](#farmbitdeath)
18. [blurb](#blurb)
19. [click](#click)
20. [rainstopped](#rainstopped)
21. [history](#history)
22. [endgame](#endgame)

### Enumerators and Constants
1. [Emotes](#Emotes)
1. [Buys](#Buys)
1. [Names](#Names)
1. [Speed](#SpeedConst)
1. [Achievements](#Achievements)
1. [Thing Type](#Thing_Type)
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
1. [Data Short](#DataShort)
1. [Data Matrices](#DataMatrices)

<a name="gamestate"/>

#### gamestate (index=0)
| Key | Value | Description |
| --- | --- | --- |
| tiles | pako.gzip(uint8_tile_array()).join() | See [Data Matrices](#DataMatrices)   |
| farmbits | pako.gzip(uint8_farmbit_array()).join() | See [Data Matrices](#DataMatrices)   |
| items | pako.gzip(uint8_item_array()).join() |See [Data Matrices](#DataMatrices)   |
| money | gg.money | current money  |
| speed | gg.speed |  current game speed (see [Speed](#SpeedConst)) |
| achievements | achievements |A boolean array of whether the player has gotten each achievement. See [Achievements](#Achievements)   |
| num_checkpoints_completed | get_num_checkpoints_completed() | Number of tutorials completed.   |
| raining | gg.b.raining | Currently raining or not.  |
| curr_selection_type | gg.inspector.detailed_type |Selection thing type. See [Thing_Type](#Thing_Type)   |
| curr_selection_data | detailed_data() | SelectFarmbit/SelectItem/SelectTile data, depending on the curr_selection_type.  |
| camera_center | prev_center_txty | Tile that the game is currently centered on.  |
| gametime | time | Metric to count speed-adjusted time. Based on number of ticks. |
| timestamp | now | Client time.  | 

<a name="startgame"/>

#### startgame (index=1)
| Key | Value | Description |
| --- | --- | --- |
| tile_states | tile_states | 2500 element array of tile_states  |
| tile_nutritions | tile_nutritions |   | 

<a name="checkpoint"/>

#### checkpoint (index=2)
| Key | Value | Description |
| --- | --- | --- |
|  |   |  |

<a name="selecttile"/>

#### selecttile (index=3)
| Key | Value | Description |
| --- | --- | --- |
| tile | tile_data_short(t) |   |
| marks | t.marks |   | 

<a name="selectfarmbit"/>

#### selectfarmbit (index=4)
| Key | Value | Description |
| --- | --- | --- |
| farmbit | farmbit_data_short(f) |   | 

<a name="selectitem"/>

#### selectitem (index=5)
| Key | Value | Description |
| --- | --- | --- |
| item | item_data_short(it) |   |
| mark | it.mark |   | 

<a name="selectbuy"/>

#### selectbuy (index=6)
| Key | Value | Description |
| --- | --- | --- |
| buy | buy |   |
| cost | gg.shop.buy_cost(buy) |   |
| curr_money | gg.money |   |
| success | gg.money>=gg.shop.buy_cost(buy) |   |

<a name="buy"/>

#### buy (index=7)
| Key | Value | Description |
| --- | --- | --- |
| buy | gg.shop.selected_buy |   |
| tile | tile_data_short(gg.b.hover_t) |   |
| success | gg.b.placement_valid(gg.b.hover_tgg.shop.selected_buy) |   |
| buy_hovers | buy_hovers |   | 

<a name="cancelbuy"/>

#### cancelbuy (index=8)
| Key | Value | Description |
| --- | --- | --- |
| selected_buy | buy |   |
| cost | gg.shop.buy_cost(buy) |   |
| curr_money | gg.money |   |
| buy_hovers | buy_hovers |   | 

<a name="tileuseselect"/>

#### tileuseselect (index=9)
| Key | Value | Description |
| --- | --- | --- |
| tile | tile_data_short(t) |   |
| marks | t.marks |   | 

<a name="itemuseselect"/>

#### itemuseselect (index=10)
| Key | Value | Description |
| --- | --- | --- |
| item | item_data_short(it) |   |
| mark | it.mark |   |

<a name="togglenutrition"/>

#### togglenutrition (index=11)
| Key | Value | Description |
| --- | --- | --- |
| to_state | gg.b.nutrition_view |   |
| tile_nutritions | nutrition_array() |   | 

<a name="toggleshop"/>

#### toggleshop (index=12)
| Key | Value | Description |
| --- | --- | --- |
| shop_open | gg.shop.open |   | 

<a name="toggleachievements"/>

#### toggleachievements (index=13)
| Key | Value | Description |
| --- | --- | --- |
| achievements_open | gg.achievements.open |   | 


<a name="skiptutorial"/>

#### skiptutorial (index=14)
| Key | Value | Description |
| --- | --- | --- |
|(none)  |   |  |

<a name="speed"/>

#### speed (index=15)
| Key | Value | Description |
| --- | --- | --- |
| cur_speed | gg.speed |   |
| clicked_speed | speed |   | 

<a name="achievement"/>

#### achievement (index=16)
| Key | Value | Description |
| --- | --- | --- |
| name | trigger.name |   | 

<a name="farmbitdeath"/>

#### farmbitdeath (index=17)
| Key | Value | Description |
| --- | --- | --- |
| farmbit | farmbit_data_short(f) |   |
| grave | tile_data_short(f.home) |   | 

<a name="blurb"/>

#### blurb (index=18)
| Key | Value | Description |
| --- | --- | --- |
|(none)  |   |  |


<a name="click"/>

#### click (index=19)
| Key | Value | Description |
| --- | --- | --- |
|(not currently implemented)  |   |  |


<a name="rainstopped"/>

#### rainstopped (index=20)
| Key | Value | Description |
| --- | --- | --- |
|(none)  |   |  |

<a name="history"/>

#### history (index=21)
| Key | Value | Description |
| --- | --- | --- |
| client_time | now |   |
| camera_history | flush_camera_history(now) |   |
| emote_history | flush_emote_history(now) |   | 

<a name="endgame"/>

#### endgame (index=22)
| Key | Value | Description |
| --- | --- | --- |
|(none)  |   |Seperate history and gamestate logs are sent.  |


### Enumerators and Constants
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
|1| pause | |
|2| play | |
|3| fast | |
|4| vfast | |

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


<a name="Thing_Type"/>

#### Thing_Type 
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| tile | |
|2| item | |
|3| farmbit | |

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

### Tile Type
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

### Job Type
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

### Item Type
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| water | |
|2| food | |
|3| poop | |
|4| fertilizer | |
|5| milk | |

<a name="JobState"/>

### Job State
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| get | |
|2| seek | |
|3| act | |

<a name="FarmbitState"/>

### Farmbit State
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| dire | |
|2| desperate | |
|3| motivated | |

<a name="FarmbitNeed"/>

### Farmbit Need
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| fullness | |
|2| energy | |
|3| joy | |
|4| fulfillment | |

<a name="Direction"/>

### Direction
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

### Mark
| Index | Name | Description |
| --- | --- | --- | 
|0| null | |
|1| use | |
|2| sell | |
|3| feed | |


### Data Structures
<a name="DataShort"/>

#### Data Short 
These are each uint8 vectors. They are as follows:
1. Tile

| Index | Name | Description |
| --- | --- | --- | 
|0| val/nutrition_max*255 | |
|1| nutrition/nutrition_max*255 | |
|2| og_type | |
|3| type | |
2. Farmbit

| Index | Name | Description |
| --- | --- | --- | 
|0| tile.wx | |
|1| tile.wy | |
|2| name | |
|3| job_state | |
|4| job_type | |
|5| fullness/max_fullness*255 | |
|6| energy/max_energy*255 | |
|7| joy/max_joy*255 | |
|8| fulfillment/max_fulfillment*255 | |
3. Item

| Index | Name | Description |
| --- | --- | --- | 
|0| wx | |
|1| wy | |
|2| type | |
|3| mark | |

<a name="DataMatrices"/>

#### Data Matrices 
The gamestate log contains uint8 arrays of all tiles, farmbits, and items. 
These arrays are concatenated data_short arrays, and can be thought of as matrices where the row (farmbit/tile/item instance)
is index//vars_per_entry and the column is index%vars_per_entry.
