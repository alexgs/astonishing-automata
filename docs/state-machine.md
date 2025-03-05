# State machine

_Automata_ uses a state machine to track a user's progress through the character creation process. This ensures that the user makes valid choices and follows a logical progression. The state machine is implemented using XState, a library for creating state machines and statecharts in JavaScript.

```mermaid
stateDiagram-v2
    [*] --> select_species
    select_species --> select_class: Species selected
    select_class --> select_subclass: Subclass required?
    select_class --> select_class_features: Subclass not required
    select_subclass --> select_class_features: Subclass selected
    select_class_features --> select_ability_score_method: Class features selected

    select_ability_score_method --> ability_score_standard: Chose Standard Array
    select_ability_score_method --> ability_score_point_buy: Chose Point Buy
    select_ability_score_method --> ability_score_rolled: Chose Roll for Stats

    ability_score_standard --> select_background: Assigned scores
    ability_score_point_buy --> select_background: Assigned scores
    ability_score_rolled --> select_background: Assigned scores
    select_background --> select_background_features: Background selected

    select_background_features --> select_equipment_method: Background features selected
    select_equipment_method --> equipment_starting: Chose starting equipment
    select_equipment_method --> equipment_gold_buy: Chose gold buy

    equipment_starting --> select_spells: Equipment assigned
    equipment_gold_buy --> select_spells: Equipment assigned

    select_spells --> final_review: Spells selected
    final_review --> [*]: Character finalized

    %% Pretty names
    select_species: Select Species
    select_class: Select Class
    select_subclass: Select Subclass
    select_class_features: Select Class Features
    select_ability_score_method: Choose Ability Score Method
    ability_score_standard: Standard Array
    ability_score_point_buy: Point Buy
    ability_score_rolled: Roll for Stats
    select_background: Select Background
    select_background_features: Choose Background Features
    select_equipment_method: Choose Equipment Method
    select_spells: Select Spells
    final_review: Final Review
    equipment_starting: Starting Equipment
    equipment_gold_buy: Gold Buy

    %% Back transitions
    select_class --> select_species: Back
    select_subclass --> select_class: Back
    select_class_features --> select_class: Back
    select_ability_score_method --> select_class_features: Back
    select_background --> select_ability_score_method: Back
    select_background_features --> select_background: Back
    select_equipment_method --> select_background_features: Back
    equipment_starting --> select_equipment_method: Back
    equipment_gold_buy --> select_equipment_method: Back
    select_spells --> select_equipment_method: Back
    final_review --> select_spells: Back
```
