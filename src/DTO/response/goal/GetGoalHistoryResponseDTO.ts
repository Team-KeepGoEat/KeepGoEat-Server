export default interface GetGoalHistoryResponseDTO {    
    goalId: number;
    isMore: boolean;
    thisMonthCount: number;
    lastMonthCount: number;
    food: string;
    criterion: string;
    blankBoxCount: number;
    emptyBoxCount: number;
}