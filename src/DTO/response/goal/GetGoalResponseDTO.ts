export default interface GetGoalResponseDTO {
    goalId: number,
    food: string,
    criterion: string,
    isMore: boolean,
    isOngoing: boolean,
    totalCount: number,
    startedAt: string,
    keptAt: string,
    isAchieved: boolean,
    writerId: number
}