import GetGoalResponseDTO from "./GetGoalResponseDTO";

export default interface GetHomeGoalResponseDTO extends GetGoalResponseDTO {
    thisMonthCount: number;
}