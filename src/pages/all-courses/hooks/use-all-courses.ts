import {useState, useMemo, useCallback} from 'react';
import {useNavigate} from 'react-router-dom';
import {useQuery} from 'react-query';

import {axios} from 'shared/core';

import type {ChangeEvent} from 'react';
import type {CourseWithLessonsCount} from '../typedef';


const PAGE_COURSES_COUNT = 12;

export const useAllCourses = () => {
	const [page, setPage] = useState(0);
	const navigate = useNavigate();

	const {isLoading, data: allCourses} = useQuery<CourseWithLessonsCount[]>('all-courses', () => (
		axios.get('/core/preview-courses')
			.then((response) => response.data?.courses)
	));

	const pageCount = useMemo(() => (
		allCourses ? Math.ceil(allCourses.length / PAGE_COURSES_COUNT) : 1
	), [allCourses]);

	const handlePageChange = useCallback((event: ChangeEvent<unknown>, newPage: number) => {
		setPage(newPage - 1);
	}, []);

	const selectedCourses = useMemo(() => (
		allCourses ? allCourses.slice(page * PAGE_COURSES_COUNT, (page + 1) * PAGE_COURSES_COUNT) : []
	), [allCourses, page]);

	const handleCoursePreviewClick = useCallback((courseId: string) => {
		navigate(`/${courseId}`)
	}, [navigate]);

	const navigateToHome = useCallback(() => {
		navigate('/');
	}, [navigate])

	return {
		page, handlePageChange, pageCount, isLoading, selectedCourses, navigateToHome, handleCoursePreviewClick
	};
};
